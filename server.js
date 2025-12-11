import express from 'express';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Для OpenSSL certs, если нужно

neonConfig.webSocketConstructor = ws;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// API handlers (как в предыдущем)

// Login
app.post('/api/login', async (req, res) => {
  // Код из login.js
  const { phone, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (rows.length === 0) return res.status(400).json({ error: 'Пользователь не найден' });

    const user = rows[0];
    if (user.password !== password.trim()) return res.status(400).json({ error: 'Неверный пароль' });

    res.status(200).json({ id: user.id, phone: user.phone, name: user.name, role: user.role || 'user' });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Register
app.post('/api/register', async (req, res) => {
  // Код из register.js
  const { phone, name, password } = req.body;
  if (!phone || !name || !password) return res.status(400).json({ error: 'Заполните все поля' });

  try {
    const check = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (check.rows.length > 0) return res.status(400).json({ error: 'Пользователь существует' });

    const result = await pool.query(
      'INSERT INTO users (phone, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, phone, name, role',
      [phone.trim(), name.trim(), password.trim(), 'user']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error in register:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Menu
app.all('/api/menu/:id?', async (req, res) => {
  // Код из menu.js с исправлениями
  const id = req.params.id;
  try {
    if (req.method === 'GET' && !id) {
      const { rows } = await pool.query('SELECT * FROM menu');
      res.status(200).json(rows);
    } else if (req.method === 'POST' && !id) {
      const { name, price, image, category, composition } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO menu (name, price, image, category, composition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, image, category, composition]
      );
      res.status(201).json(rows[0]);
    } else if (req.method === 'PUT' && id) {
      const { name, price, image, category, composition } = req.body;
      const { rows } = await pool.query(
        'UPDATE menu SET name = $1, price = $2, image = $3, category = $4, composition = $5 WHERE id = $6 RETURNING *',
        [name, price, image, category, composition, id]
      );
      res.status(200).json(rows[0]);
    } else if (req.method === 'DELETE' && id) {
      await pool.query('DELETE FROM menu WHERE id = $1', [id]);
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: err.message || 'Ошибка БД' });
  }
});

// Orders
app.all('/api/orders/:userId?', async (req, res) => {
  // Код из orders.js
  const userId = req.params.userId;
  try {
    if (req.method === 'POST' && !userId) {
      const { user_id, items, total } = req.body;
      const result = await pool.query(
        'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING id',
        [user_id, JSON.stringify(items), total]
      );
      res.status(201).json({ id: result.rows[0].id });
    } else if (req.method === 'GET' && userId) {
      const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.status(200).json(result.rows);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error in orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Инициализация БД
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user'
      );
      CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price VARCHAR(20) NOT NULL,
        image TEXT,
        category VARCHAR(50) NOT NULL,
        composition TEXT
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        items JSONB NOT NULL,
        total VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Таблицы БД созданы/проверены');
  } catch (err) {
    console.error('Ошибка инициализации БД:', err.message);
  }
})();

// Для OpenSSL (HTTPS) - +1 балл, раскомментируй и добавь certs
// const https = require('https');
// const options = {
//   key: fs.readFileSync('path/to/key.pem'),
//   cert: fs.readFileSync('path/to/cert.pem')
// };
// https.createServer(options, app).listen(port, () => console.log(`HTTPS on ${port}`));

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});