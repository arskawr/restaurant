// api/auth/login.js

import { Pool } from 'pg';

// Создаем пул подключений к PostgreSQL (Supabase)
// Следующие переменные должны быть настроены в Vercel:
// DB_HOST, DB_USER, DB_PASS, DB_NAME, (опционально DB_PORT)
const pool = new Pool({
  host: process.env.DB_HOST,              // пример: db.xvgqfaziatjesrraqodo.supabase.co
  user: process.env.DB_USER,              // пример: postgres
  password: process.env.DB_PASS,          // ваш пароль
  database: process.env.DB_NAME,          // пример: postgres
  port: process.env.DB_PORT || 5432,       // по умолчанию для PostgreSQL 5432
  ssl: { rejectUnauthorized: false }      // для работы с Supabase требуется SSL; в продакшене настройте сертификаты
});

export default async function handler(req, res) {
  // Обработка preflight-запроса OPTIONS для CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Устанавливаем CORS-заголовок для POST-запроса
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Получаем данные запроса
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите номер и пароль' });
  }

  try {
    // Выполняем запрос к таблице users
    const query = 'SELECT * FROM users WHERE phone = $1';
    const values = [phone.trim()];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    // Сравниваем пароль (на реальном проекте рекомендуется использовать хэширование)
    if (user.password.trim() !== password.trim()) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    // Возвращаем данные авторизованного пользователя
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
