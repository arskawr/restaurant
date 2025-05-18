// api/auth/login.js
import { Pool } from 'pg';

// Настройка подключения к базе данных (переменные окружения должны быть заданы на Vercel или в .env)
const pool = new Pool({
  host: process.env.DB_HOST,       // например: aws-0-eu-west-2.pooler.supabase.com
  user: process.env.DB_USER,       // например: postgres.xvgqfaziatjesrraqodo
  password: process.env.DB_PASS,   // ваш пароль
  database: process.env.DB_NAME,   // например: postgres
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
      const { phone, password } = JSON.parse(body);
      if (!phone || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Введите номер и пароль.' }));
      }
      const query = 'SELECT * FROM users WHERE phone = $1';
      const values = [phone.trim()];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Пользователь не найден' }));
      }
      const user = result.rows[0];
      if (user.password.trim() !== password.trim()) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Неверный пароль' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }));
    } catch (err) {
      console.error("Ошибка в login:", err);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });
}
