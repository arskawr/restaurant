import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
import { parse } from 'url';

neonConfig.webSocketConstructor = ws;  // обязательно для Vercel Node

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);

  try {
    if (req.method === 'GET' && pathname === '/api/menu') {
      const { rows } = await pool.query('SELECT * FROM menu');
      res.status(200).json(rows);
    } else if (req.method === 'POST' && pathname === '/api/menu') {
      const { name, price, image, category, composition } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO menu (name, price, image, category, composition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, image, category, composition]
      );
      res.status(201).json(rows[0]);
    } else if (req.method === 'PUT' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      const { name, price, image, category, composition } = req.body;
      const { rows } = await pool.query(
        'UPDATE menu SET name = $1, price = $2, image = $3, category = $4, composition = $5 WHERE id = $6 RETURNING *',
        [name, price, image, category, composition, id]
      );
      res.status(200).json(rows[0]);
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      await pool.query('DELETE FROM menu WHERE id = $1', [id]);
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: err.message || 'Ошибка БД' });
  }
}