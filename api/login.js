import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (rows.length === 0) return res.status(400).json({ error: 'Пользователь не найден' });

    const user = rows[0];
    if (user.password !== password.trim()) return res.status(400).json({ error: 'Неверный пароль' });

    res.status(200).json({ id: user.id, phone: user.phone, name: user.name, role: user.role || 'user' });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}