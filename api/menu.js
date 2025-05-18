// api/menu.js
// Этот файл обрабатывает запросы к меню:
// • GET /api/menu             - получение списка блюд
// • POST /api/menu            - создание нового блюда
// • GET /api/menu/{id}        - получение блюда по ID
// • PUT /api/menu/{id}        - обновление блюда по ID
// • DELETE /api/menu/{id}     - удаление блюда по ID

import { parse } from 'url';
import { Pool } from 'pg';

// Подключение к базе данных
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 6543,
  ssl: { rejectUnauthorized: false },
  family: 4
});

// Обработка запроса
export default async function handler(req, res) {
  // Разбираем URL, чтобы определить, есть ли параметр ID
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname; // Например: "/api/menu" или "/api/menu/9"
  const cleanPath = pathname.replace(/\/+$/, ""); // удаляем конечные слэши

  // Если путь ровно "/api/menu" — обрабатываем GET и POST запросы
  if (cleanPath === '/api/menu') {
    if (req.method === 'GET') {
      try {
        const result = await pool.query('SELECT * FROM menu');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result.rows));
      } catch (err) {
        console.error("Ошибка при получении меню:", err);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: err.message }));
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const newItem = JSON.parse(body);
          if (!newItem.name || !newItem.price || !newItem.image) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Заполните все поля для нового блюда.' }));
          }
          const query = `
            INSERT INTO menu (name, price, image, category, composition)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
          `;
          const values = [newItem.name, newItem.price, newItem.image, newItem.category, newItem.composition || ''];
          const result = await pool.query(query, values);
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(result.rows[0]));
        } catch (err) {
          console.error("Ошибка при добавлении блюда:", err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', ['GET', 'POST']);
      return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
    }
    return;
  }

  // Обработка маршрутов вида "/api/menu/{id}"
  const parts = cleanPath.split('/');
  if (parts.length !== 3 || isNaN(parts[2])) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: 'Неверный путь' }));
  }
  const id = parts[2];

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM menu WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Блюдо не найдено' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
      console.error("Ошибка получения блюда:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const updatedItem = JSON.parse(body);
        const query = `
          UPDATE menu
          SET name = $1, price = $2, image = $3, category = $4, composition = $5
          WHERE id = $6
          RETURNING *
        `;
        const values = [updatedItem.name, updatedItem.price, updatedItem.image, updatedItem.category, updatedItem.composition || '', id];
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Блюдо не найдено' }));
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(result.rows[0]));
      } catch (err) {
        console.error("Ошибка обновления блюда:", err);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM menu WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Блюдо не найдено' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
      console.error("Ошибка при удалении блюда:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.statusCode = 405;
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
  }
}
