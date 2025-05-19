// api/orders.js
// Обрабатывает запросы к заказам:
// • GET /api/orders             — общий список заказов (опционально)
// • POST /api/orders            — создание нового заказа
// • GET /api/orders/{userId}    — получение истории заказов для пользователя

import { parse } from 'url';
import { Pool } from 'pg';

console.log("Orders API endpoint загружен."); // Лог для отладки

const pool = new Pool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASS,   
  database: process.env.DB_NAME,   
  port: process.env.DB_PORT || 6543,
  ssl: { rejectUnauthorized: false },
  family: 4
});

export default async function handler(req, res) {
  console.log("Orders API вызван, req.url =", req.url);
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;  // Например: "/api/orders" или "/api/orders/1"
  const cleanPath = pathname.replace(/\/+$/, ""); // удаляем конечные слэши

  // Если путь ровно "/api/orders" – обрабатываем общий запрос или создание заказа
  if (cleanPath === '/api/orders') {
    if (req.method === 'GET') {
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
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const orderData = JSON.parse(body);
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
      res.setHeader('Allow', ['GET', 'POST']);
      return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
    }
  }

  // Если путь имеет вид "/api/orders/{userId}"
  // При запросе "/api/orders/1" split даст: ["", "api", "orders", "1"]
  const parts = cleanPath.split('/');
  if (parts.length === 4 && !isNaN(parts[3])) {
    const userId = parts[3];
    if (req.method === 'GET') {
      try {
        const query = 'SELECT * FROM orders WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result.rows));
      } catch (err) {
        console.error("Ошибка при получении истории заказов для user_id =", userId, err);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: err.message }));
      }
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', ['GET']);
      return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
    }
  } else {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Неверный путь' }));
  }
}
