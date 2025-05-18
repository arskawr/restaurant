// api/auth/login.js
// Этот API-роут обрабатывает POST-запросы для авторизации пользователя

import { Pool } from 'pg';

// Настроим пул соединений с использованием переменных окружения.
// Для Transaction Pooler Supabase используйте следующие параметры:
// DB_HOST: aws-0-eu-west-2.pooler.supabase.com  
// DB_PORT: 6543  
// DB_USER: postgres.xvgqfaziatjesrraqodo  
// DB_PASS: ваш пароль  
// DB_NAME: postgres
const pool = new Pool({
  host: process.env.DB_HOST,              // например, aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,              // например, postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,          // ваш реальный пароль
  database: process.env.DB_NAME,          // например, postgres
  port: process.env.DB_PORT || 6543,       // порт для Transaction Pooler (или 5432, если стандартный)
  ssl: { rejectUnauthorized: false },    // необходимо для SSL-подключения
  family: 4                               // форсируем использование IPv4
});

export default async function handler(req, res) {
  console.log("DB_HOST from env:", process.env.DB_HOST);
  console.log("Вход в функцию login. Метод запроса:", req.method);

  // Обработка preflight-запроса OPTIONS для CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { phone, password } = req.body;
  console.log("Получен запрос с данными:", req.body);
  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите номер и пароль' });
  }

  try {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const values = [phone.trim()];
    console.log("Выполняется запрос:", query, values);
    const result = await pool.query(query, values);
    console.log("Результат запроса:", result.rows);

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
    console.error("Ошибка в логине:", err);
    return res.status(500).json({ error: err.message });
  }
}
