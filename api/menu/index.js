// api/menu/index.js
// Обрабатывает GET-запросы для получения списка блюд из таблицы menu

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,              // aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,              // postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,          // ваш пароль
  database: process.env.DB_NAME,          // postgres
  port: process.env.DB_PORT || 6543,       // порт 6543
  ssl: { rejectUnauthorized: false },
  family: 4
});

export default async function handler(req, res) {
  console.log("Вход в функцию menu. Метод запроса:", req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const query = 'SELECT * FROM menu';
    console.log("Выполняется запрос меню:", query);
    const result = await pool.query(query);
    console.log("Результат меню:", result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении меню:", err);
    return res.status(500).json({ error: err.message });
  }
}
