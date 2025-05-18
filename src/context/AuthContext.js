// src/context/AuthContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// Для демонстрации используются "заглушки". 
// В реальном приложении необходимо делать запросы к серверу.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  /*  
    Структура user: {
      phone: '+375291234567',
      name: 'Иван',
      role: 'user'  // или 'admin'
    }
  */

  const login = ({ phone, password }) => {
    // Пример заглушки: два "пользователя"
    const dummyUsers = [
      { phone: '+375291234567', password: 'userpass', name: 'Иван', role: 'user' },
      { phone: '+375299876543', password: 'adminpass', name: 'Администратор', role: 'admin' },
    ];
    const found = dummyUsers.find(
      (u) => u.phone === phone && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    } else {
      return false;
    }
  };

  const register = ({ phone, name, password }) => {
    // Здесь может быть вызов API. Пока что симулируем регистрацию.
    // По умолчанию зарегистрированный пользователь имеет роль "user".
    const newUser = { phone, name, password, role: 'user' };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
