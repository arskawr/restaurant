// api/orders/[id].js
// Обрабатывает GET-запросы для получения истории заказов по идентификатору пользователя

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
  console.log("Вход в функцию orders (GET history). Метод запроса:", req.method);

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Отсутствует идентификатор пользователя' });
  }

  try {
    const query = 'SELECT * FROM orders WHERE user_id = $1';
    const values = [id];
    console.log("Выполняется запрос заказов:", query, values);
    const result = await pool.query(query, values);
    console.log("Результат запроса заказов:", result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    return res.status(500).json({ error: err.message });
  }
}
