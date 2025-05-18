// api/orders/index.js
// Обрабатывает POST-запросы для создания нового заказа (checkout)

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
  console.log("Вход в функцию orders (POST create order). Метод запроса:", req.method);
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ожидаем, что тело запроса содержит user_id, items и total
  const { user_id, items, total } = req.body;
  console.log("Полученные данные заказа:", req.body);
  if (!user_id || !items || !total) {
    return res.status(400).json({ error: 'Требуются параметры: user_id, items, total' });
  }

  try {
    // Если items передается как объект или массив, можно сохранить его как JSON-строку:
    const itemsText = typeof items === 'string' ? items : JSON.stringify(items);
    
    const query = 'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING *';
    const values = [user_id, itemsText, total];
    console.log("Выполняется запрос создания заказа:", query, values);
    const result = await pool.query(query, values);
    console.log("Новый заказ добавлен:", result.rows);
    return res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    return res.status(500).json({ error: err.message });
  }
}
