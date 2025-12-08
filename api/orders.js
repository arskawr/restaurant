import { Pool } from 'pg';
import { parse } from 'url';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);
  const parts = pathname.split('/');

  if (req.method === 'POST' && parts.length === 3 && parts[2] === '') {
    const { user_id, items, total } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING id',
        [user_id, items, total]
      );
      res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET' && parts.length === 4 && !isNaN(parts[3])) {
    const userId = parts[3];
    try {
      const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}