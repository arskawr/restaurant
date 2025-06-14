import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const LoginPage = () => {
  const { setUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Все поля обязательны для заполнения.');
      return;
    }
    if (!phoneRegex.test(phone.trim())) {
      setError('Неверный формат номера телефона. Формат: +37529 123 45 67');
      return;
    }
    try {
      const data = await login({ phone: phone.trim(), password: password.trim() });
      setUser(data);
      navigate('/account');
    } catch (err) {
      // Ошибка уже устанавливается в контексте, можно дополнительно вывести её
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">Вход в систему</div>
      <div className="auth-box">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>Номер телефона:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+37529 123 45 67"
            required
          />
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
