import dotenv from 'dotenv';
dotenv.config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Настройка подключения к MySQL (замените параметры на свои)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL подключен.');
});

// ---------------------- MENU ENDPOINTS -------------------------

// GET: получить все блюда
app.get('/api/menu', (req, res) => {
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST: добавить новое блюдо (с полем composition)
app.post('/api/menu', (req, res) => {
  const { name, price, image, category, composition } = req.body;
  if (!name || !price || !image || !category) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }
  const sql = "INSERT INTO menu (name, price, image, category, composition) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, price, image, category, composition || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, price, image, category, composition: composition || '' });
  });
});

// PUT: редактировать блюдо по id (включая composition)
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, image, category, composition } = req.body;
  console.log(`Получен запрос на обновление блюда id ${id}:`, req.body);
  const sql = "UPDATE menu SET name = ?, price = ?, image = ?, category = ?, composition = ? WHERE id = ?";
  db.query(sql, [name, price, image, category, composition, id], (err, result) => {
    if (err) {
      console.error("Ошибка при обновлении блюда:", err);
      return res.status(500).json({ error: err.message });
    }
    // Выполняем SELECT, чтобы вернуть актуальные данные
    db.query("SELECT * FROM menu WHERE id = ?", [id], (err, rows) => {
      if (err) {
        console.error("Ошибка при получении обновлённого блюда:", err);
        return res.status(500).json({ error: err.message });
      }
      if (!rows.length) {
        return res.status(404).json({ error: "Блюдо не найдено" });
      }
      console.log(`Блюдо id ${id} обновлено. Новые данные:`, rows[0]);
      res.json(rows[0]);
    });
  });
});



// DELETE: удалить блюдо по id
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM menu WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Блюдо удалено' });
  });
});

// ---------------------- AUTH ENDPOINTS -------------------------

// Регистрация пользователя
app.post('/api/auth/register', (req, res) => {
  const { phone, name, password } = req.body;
  if (!phone || !name || !password) {
    return res.status(400).json({ error: 'Заполните все необходимые поля' });
  }
  const trimmedPhone = phone.trim();
  const trimmedName = name.trim();
  const trimmedPassword = password.trim();

  const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  const nameRegex = /^[А-Яа-яЁё\s]+$/;
  if (!phoneRegex.test(trimmedPhone)) {
    return res.status(400).json({ error: 'Неверный формат номера телефона. Формат: +37529 123 45 67' });
  }
  if (!nameRegex.test(trimmedName)) {
    return res.status(400).json({ error: 'Имя должно содержать только буквы русского алфавита.' });
  }
  if (trimmedPassword.length < 6) {
    return res.status(400).json({ error: 'Пароль должен содержать не менее 6 символов.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE phone = ?';
  db.query(checkQuery, [trimmedPhone], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким номером уже существует' });
    }
    const insertQuery = 'INSERT INTO users (phone, name, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [trimmedPhone, trimmedName, trimmedPassword, 'user'], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        id: result.insertId, 
        phone: trimmedPhone, 
        name: trimmedName, 
        role: 'user' 
      });
    });
  });
});



// Вход (логин)
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Все поля обязательны для входа' });
  }
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();

  const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  if (!phoneRegex.test(trimmedPhone)) {
    return res.status(400).json({ error: 'Неверный формат номера телефона. Формат: +37529 123 45 67' });
  }

  const query = 'SELECT * FROM users WHERE phone = ?';
  db.query(query, [trimmedPhone], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }
    const user = results[0];
    if (user.password.trim() !== trimmedPassword) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }
    res.status(200).json({ 
      id: user.id, 
      phone: user.phone, 
      name: user.name, 
      role: user.role 
    });
  });
});


// ---------------------- ORDERS ENDPOINTS -------------------------

// Создание нового заказа (заказ привязан к конкретному пользователю)
app.post('/api/orders', (req, res) => {
  console.log('POST /api/orders:', req.body);
  const { user_id, items, total } = req.body;
  if (!user_id || !items || total == null) {
    return res.status(400).json({ error: 'Заполните все поля заказа' });
  }
  const itemsToStore = Array.isArray(items) ? items : [items];
  const itemsStr = JSON.stringify(itemsToStore);
  const numericTotal = parseFloat(String(total).replace(/[^0-9.-]+/g, ""));
  if (isNaN(numericTotal)) {
    return res.status(400).json({ error: 'Неверное значение суммы заказа.' });
  }
  const query = 'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)';
  db.query(query, [user_id, itemsStr, numericTotal], (err, result) => {
    if (err) {
      console.error('Ошибка при сохранении заказа:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Заказ сохранен, id:', result.insertId);
    res.json({ id: result.insertId, user_id, items: itemsStr, total: numericTotal });
  });
});

// Получение истории заказов для конкретного пользователя
app.get('/api/orders/:user_id', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Ошибка при получении заказов:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ---------------------- Запуск сервера -------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
