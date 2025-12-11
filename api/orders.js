import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const { pathname } = parse(req.url, true);

  try {
    if (req.method === 'POST' && pathname === '/api/orders') {
      const { user_id, items, total } = req.body;
      const result = await pool.query(
        'INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3) RETURNING id',
        [user_id, JSON.stringify(items), total]
      );
      res.status(201).json({ id: result.rows[0].id });
    } else if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
      const userId = pathname.split('/')[3];
      const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.status(200).json(result.rows);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('DB error in orders:', err.message);
    res.status(500).json({ error: err.message });
  }
}