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
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        throw new Error(data.error);
      }
      setUser(data);
      setError('');
      return data;
    } catch (err) {
      console.error('Ошибка в login:', err);
      throw err;
    }
  };

  const register = async ({ phone, name, password }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, password }),
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
    <AuthContext.Provider value={{ user, setUser, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
