// src/context/AuthContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = async ({ phone, password }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      // Получаем ответ в виде текста для отладки
      const text = await res.text();
      console.log("Ответ с API (текст):", text);

      if (!text) {
        throw new Error("Пустой ответ от сервера");
      }

      // Парсим полученный текст как JSON
      const data = JSON.parse(text);
      setUser(data);
      setError('');
      return data;
    } catch (err) {
      console.error('Ошибка в login:', err);
      setError(err.message);
      throw err;
    }
  };

  const register = async ({ phone, name, password }) => {
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: trimmedPhone,
          name,
          password: trimmedPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        throw new Error(data.error);
      }
      setUser(data);
      setError('');
      return data;
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
