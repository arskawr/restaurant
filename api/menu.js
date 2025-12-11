import { Client } from 'pg';
import { parse } from 'url';

async function getClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);

  const client = await getClient();

  try {
    if (req.method === 'GET' && pathname === '/api/menu') {
      const result = await client.query('SELECT * FROM menu');
      res.status(200).json(result.rows);
    } else if (req.method === 'POST' && pathname === '/api/menu') {
      const { name, price, image, category, composition } = req.body;
      const result = await client.query(
        'INSERT INTO menu (name, price, image, category, composition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, image, category, composition]
      );
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      const { name, price, image, category, composition } = req.body;
      const result = await client.query(
        'UPDATE menu SET name = $1, price = $2, image = $3, category = $4, composition = $5 WHERE id = $6 RETURNING *',
        [name, price, image, category, composition, id]
      );
      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/menu/')) {
      const id = pathname.split('/')[3];
      await client.query('DELETE FROM menu WHERE id = $1', [id]);
      res.status(204).end();
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error in menu:', err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  } finally {
    await client.end();
  }
}