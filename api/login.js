import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Заполните все поля' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Пользователь не найден' });

    const user = result.rows[0];
    if (user.password !== password.trim()) return res.status(400).json({ error: 'Неверный пароль' });

    res.status(200).json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role || 'user'
    });
  } catch (err) {
    console.error('DB error in login:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}