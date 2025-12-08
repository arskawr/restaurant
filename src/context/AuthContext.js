import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = async ({ phone, password }) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
        throw new Error(data.error || 'Ошибка входа');
      }

      setUser(data);
      setError('');
      return data;
    } catch (err) {
      const message = err.message || 'Нет соединения с сервером';
      setError(message);
      throw err;
    }
  };

  const register = async ({ phone, name, password }) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка регистрации');
        throw new Error(data.error || 'Ошибка регистрации');
      }

      setUser(data);
      setError('');
      return data;
    } catch (err) {
      const message = err.message || 'Нет соединения с сервером';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};