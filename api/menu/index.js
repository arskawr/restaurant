// api/menu/index.js
// Этот API-роут обрабатывает GET-запрос для получения списка блюд из таблицы menu

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,              // например: aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,              // например, postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,          // ваш пароль
  database: process.env.DB_NAME,          // например, postgres
  port: process.env.DB_PORT || 6543,       // используйте порт из переменной или 6543
  ssl: { rejectUnauthorized: false },
  family: 4
});

export default async function handler(req, res) {
  console.log("Вход в функцию menu. Метод запроса:", req.method);

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
