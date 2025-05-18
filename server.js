// server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Настройте подключение к MySQL (замените параметры на свои)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '31214858',
  database: 'spatkanne'
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL подключен.');
});



// GET: получить все блюда
app.get('/api/menu', (req, res) => {
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST: добавить новое блюдо
app.post('/api/menu', (req, res) => {
  const { name, price, image, category } = req.body;
  if (!name || !price || !image || !category) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }
  const sql = "INSERT INTO menu (name, price, image, category) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, image, category], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, name, price, image, category });
  });
});

// PUT: редактировать блюдо по id
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, image, category } = req.body;
  const sql = "UPDATE menu SET name = ?, price = ?, image = ?, category = ? WHERE id = ?";
  db.query(sql, [name, price, image, category, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name, price, image, category });
  });
});

// DELETE: удалить блюдо по id
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM menu WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Блюдо удалено' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
