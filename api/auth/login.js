// api/auth/login.js

import mysql from 'mysql2';

// Пул подключений для serverless-функции.
// Используйте переменные окружения для настройки (на Vercel их задаете в настройках проекта).
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // например, 'localhost' или хост БД
  user: process.env.DB_USER,      // имя пользователя БД
  password: process.env.DB_PASS,  // пароль
  database: process.env.DB_NAME,  // имя базы данных
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

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
