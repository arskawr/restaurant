// pages/api/menu/[id].js
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,              // Например: aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,              // Например: postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,          // Ваш пароль
  database: process.env.DB_NAME,          // Например: postgres
  port: process.env.DB_PORT || 6543,       // Например, 6543 для Transaction Pooler
  ssl: { rejectUnauthorized: false },
  family: 4
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Не указан ID блюда' });
  }

  if (req.method === 'PUT') {
    // Обновляем данные блюда
    try {
      const { name, price, image, category, composition } = req.body;
      const query = `
        UPDATE menu 
        SET name = $1, price = $2, image = $3, category = $4, composition = $5
        WHERE id = $6
        RETURNING *
      `;
      const values = [name, price, image, category, composition, id];
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Блюдо не найдено' });
      }
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка обновления блюда:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    // Удаляем блюдо
    try {
      const query = "DELETE FROM menu WHERE id = $1 RETURNING *";
      const values = [id];
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Блюдо не найдено' });
      }
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка при удалении блюда:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET') {
    // Получение данных блюда по id (опционально)
    try {
      const query = "SELECT * FROM menu WHERE id = $1";
      const values = [id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Блюдо не найдено' });
      }
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка получения блюда:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Метод ${req.method} не поддерживается` });
  }
}
