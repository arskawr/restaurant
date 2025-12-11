import { Client } from 'pg';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  const client = await getClient();

  try {
    const check = await client.query('SELECT * FROM users WHERE phone = $1', [phone.trim()]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким номером уже существует' });
    }

    const result = await client.query(
      'INSERT INTO users (phone, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, phone, name, role',
      [phone.trim(), name.trim(), password.trim(), 'user']
    );

    res.status(201).json({
      id: result.rows[0].id,
      phone: result.rows[0].phone,
      name: result.rows[0].name,
      role: result.rows[0].role
    });
  } catch (err) {
    console.error('DB error in register:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  } finally {
    await client.end();
  }
}