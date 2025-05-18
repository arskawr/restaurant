// api/auth/login.js

import { Pool } from 'pg';

// Создаем пул подключений к PostgreSQL (Supabase)
const pool = new Pool({
  host: process.env.DB_HOST,              // например: db.xvgqfaziatjesrraqodo.supabase.co
  user: process.env.DB_USER,              // например: postgres
  password: process.env.DB_PASS,          // ваш реальный пароль
  database: process.env.DB_NAME,          // например: postgres
  port: process.env.DB_PORT || 5432,       // PostgreSQL по умолчанию 5432
  ssl: { rejectUnauthorized: false }      // Обязательно для Supabase
});

export default async function handler(req, res) {
  // Обработка preflight OPTIONS для CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Устанавливаем CORS-заголовок
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите номер и пароль' });
  }

  try {
    // Выполняем запрос к таблице users
    const query = 'SELECT * FROM users WHERE phone = $1';
    const values = [phone.trim()];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    if (user.password.trim() !== password.trim()) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    return res.status(200).json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error('Ошибка в логине:', err);
    return res.status(500).json({ error: err.message });
  }
}
