// src/components/RegisterPage.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles.css';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить дополнительные валидации
    register({ phone, name, password });
    navigate('/account');
  };

  return (
    <div className="register-page">
      <h1>Регистрация</h1>
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
          <label>Имя:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
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
        <button type="submit" className="submit-order">Зарегистрироваться</button>
      </form>
      <p>
        Уже зарегистрированы? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
