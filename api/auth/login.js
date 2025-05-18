// api/auth/login.js

import mysql from 'mysql2';

// Пул подключений для serverless-среды.
// Настройте переменные окружения (DB_HOST, DB_USER, DB_PASS, DB_NAME) в настройках Vercel.
const pool = mysql.createPool({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,      
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default function handler(req, res) {
  // Обработка preflight OPTIONS-запроса
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Устанавливаем CORS-заголовки для запроса POST
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  console.log("Получен запрос для авторизации:", req.body);

  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Введите номер и пароль' });
  }

  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();

  pool.query("SELECT * FROM users WHERE phone = ?", [trimmedPhone], (err, results) => {
    if (err) {
      console.error("Ошибка в запросе к БД:", err);
      return res.status(500).json({ error: err.message });
    }

    if (!results || results.length === 0) {
      console.log("Пользователь не найден");
      return res.status(400).json({ error: "Пользователь не найден" });
    }

    const user = results[0];

    if (user.password.trim() !== trimmedPassword) {
      console.log("Неверный пароль");
      return res.status(400).json({ error: "Неверный пароль" });
    }

    console.log("Авторизация успешна. Отправляем данные:", {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role
    });

    return res.status(200).json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    });
  });
}
