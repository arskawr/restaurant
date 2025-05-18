// src/components/LoginPage.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login({ phone, password })) {
      setError('Неправильный номер телефона или пароль');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="login-page">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Номер телефона:</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+375 29 ..."
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-order">Войти</button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default LoginPage;
