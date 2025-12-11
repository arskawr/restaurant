import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // ограничиваем соединения для serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});







export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
    console.log('Подключение к БД настроено');

  }

  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    if (user.password !== password.trim()) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    res.status(200).json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role || 'user'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}