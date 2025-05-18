import { Pool } from 'pg';

const pool = new Pool({
  host: "db.xvgqfaziatjesrraqodo.supabase.co", // захардкодили значение для отладки
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    console.log('DB_HOST from env:', process.env.DB_HOST);

  console.log("Вход в функцию login. Метод запроса:", req.method);
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { phone, password } = req.body;
  console.log("Получен запрос с данными:", req.body);
  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите номер и пароль' });
  }
  
  try {
    // Пробуем выполнить запрос к базе
    const query = 'SELECT * FROM users WHERE phone = $1';
    const values = [phone.trim()];
    console.log("Выполняется запрос:", query, values);
    const result = await pool.query(query, values);
    console.log("Результат запроса:", result.rows);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }
    
    const user = result.rows[0];
    if (user.password.trim() !== password.trim()) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }
    
    return res.status(200).json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error('Ошибка в логине:', err);
    return res.status(500).json({ error: err.message });
  }
}
