// api/auth/register.js
import { Pool } from 'pg';

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Метод ${req.method} не поддерживается` }));
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const { phone, password, name } = JSON.parse(body);
      if (!phone || !password || !name) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Заполните все необходимые поля' }));
      }
      // Проверка, существует ли пользователь
      const checkQuery = 'SELECT * FROM users WHERE phone = $1';
      const checkRes = await pool.query(checkQuery, [phone.trim()]);
      if (checkRes.rows.length > 0) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Пользователь с таким номером уже существует' }));
      }
      const insertQuery = `INSERT INTO users (phone, password, name, role)
                           VALUES ($1, $2, $3, 'user') RETURNING *`;
      const values = [phone.trim(), password.trim(), name.trim()];
      const result = await pool.query(insertQuery, values);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        id: result.rows[0].id,
        phone: result.rows[0].phone,
        name: result.rows[0].name,
        role: result.rows[0].role
      }));
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });
}
