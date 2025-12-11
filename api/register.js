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
  // остальной код без изменений

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  try {
    const check = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким номером уже существует' });
    }

    const result = await pool.query(
      'INSERT INTO users (phone, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, phone, name, role',
      [phone.trim(), name.trim(), password.trim(), 'user']
    );

    res.status(201).json({
      id: result.rows[0].id,
      phone: result.rows[0].phone,
      name: result.rows[0].name,
      role: result.rows[0].role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}