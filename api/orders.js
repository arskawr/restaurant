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
    if (req.method === 'POST' && pathname === '/api/orders') {
      const { user_id, items, total } = req.body;
      const result = await client.query(
        'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING id',
        [user_id, items, total]
      );
      res.status(201).json({ id: result.rows[0].id });
    } else if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const userId = pathname.split('/')[3];
      const result = await client.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.status(200).json(result.rows);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error in orders:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
}