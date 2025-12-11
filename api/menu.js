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
  const { pathname } = parse(req.url, true);

  if (req.method === 'GET' && pathname === '/api/menu') {
    try {
      const result = await pool.query('SELECT * FROM menu');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка загрузки ассортимента' });
    }
  } else if (req.method === 'POST' && pathname === '/api/menu') {
    const { name, price, image, category, composition } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO menu (name, price, image, category, composition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, image, category, composition]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'PUT' && pathname.startsWith('/api/menu/')) {
    const id = pathname.split('/')[3];
    const { name, price, image, category, composition } = req.body;
    try {
      const result = await pool.query(
        'UPDATE menu SET name = $1, price = $2, image = $3, category = $4, composition = $5 WHERE id = $6 RETURNING *',
        [name, price, image, category, composition, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE' && pathname.startsWith('/api/menu/')) {
    const id = pathname.split('/')[3];
    try {
      await pool.query('DELETE FROM menu WHERE id = $1', [id]);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}