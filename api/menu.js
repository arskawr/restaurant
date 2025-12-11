import { Pool } from 'pg';
import { parse } from 'url';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // лимит для serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);

  try {
    if (req.method === 'GET' && pathname === '/api/menu') {
      const result = await pool.query('SELECT * FROM menu');
      res.status(200).json(result.rows);
    } else if (req.method === 'POST' && pathname === '/api/menu') {
      const { name, price, image, category, composition } = req.body;
      const result = await pool.query(
        'INSERT INTO menu (name, price, image, category, composition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, image, category, composition]
      );
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      const { name, price, image, category, composition } = req.body;
      const result = await pool.query(
        'UPDATE menu SET name = $1, price = $2, image = $3, category = $4, composition = $5 WHERE id = $6 RETURNING *',
        [name, price, image, category, composition, id]
      );
      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      await pool.query('DELETE FROM menu WHERE id = $1', [id]);
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error in menu:', err.message);
    res.status(500).json({ error: 'Ошибка базы данных: ' + err.message });
  }
}