import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, name, password } = req.body;
  if (!phone || !name || !password) return res.status(400).json({ error: 'Заполните все поля' });

  try {
    const check = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (check.rows.length > 0) return res.status(400).json({ error: 'Пользователь существует' });

    const result = await pool.query(
      'INSERT INTO users (phone, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, phone, name, role',
      [phone.trim(), name.trim(), password.trim(), 'user']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error in register:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}