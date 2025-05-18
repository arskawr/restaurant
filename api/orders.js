// api/orders.js
// Обрабатывает запросы для заказов:
// • GET /api/orders              — получение всех заказов (при необходимости)
// • POST /api/orders             — создание нового заказа
// • GET /api/orders/{userId}     — получение истории заказов для пользователя с указанным userId

import { parse } from 'url';
import { Pool } from 'pg';

// Настройки подключения к базе данных
const pool = new Pool({
  host: process.env.DB_HOST,       // например: aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,       // например: postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,   // ваш пароль
  database: process.env.DB_NAME,   // например: postgres
  port: process.env.DB_PORT || 6543,// для Transaction Pooler – 6543
  ssl: { rejectUnauthorized: false },
  family: 4
});

export default async function handler(req, res) {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname; // может быть "/api/orders" или "/api/orders/1"
  const cleanPath = pathname.replace(/\/+$/, "");

  // Если путь ровно "/api/orders"
  if (cleanPath === '/api/orders') {
    if (req.method === 'GET') {
      // Если нужен общий список заказов (при необходимости, либо можно вернуть пустой массив)
      try {
        const result = await pool.query('SELECT * FROM orders');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result.rows));
      } catch (err) {
        console.error("Ошибка при получении заказов:", err);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: err.message }));
      }
    } else if (req.method === 'POST') {
      // Создание нового заказа
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const orderData = JSON.parse(body);
          // Проверяем корректность данных – должны быть заданы user_id, items и total
          if (!orderData.user_id || !orderData.items || !orderData.total) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Требуются поля: user_id, items, total' }));
          }
          const itemsText = typeof orderData.items === 'string'
            ? orderData.items
            : JSON.stringify(orderData.items);
          const query = 'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING *';
          const values = [orderData.user_id, itemsText, orderData.total];
          const result = await pool.query(query, values);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(result.rows[0]));
        } catch (err) {
          console.error("Ошибка при создании заказа:", err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else {
      res.statusCode = 405;
      return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
    }
    return;
  }

  // Если путь отличается от "/api/orders", ожидаем его вида "/api/orders/{userId}"
  const parts = cleanPath.split('/');
  // Ожидается: ["", "api", "orders", "{userId}"]
  if (parts.length !== 3 || isNaN(parts[2])) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Неверный путь' }));
  }
  const userId = parts[2];

  // Обработка GET-запроса истории заказов для указанного пользователя
  if (req.method === 'GET') {
    try {
      const query = 'SELECT * FROM orders WHERE user_id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error("Ошибка при получении истории заказов:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
  }
}
