import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const RegisterPage = () => {
  const { setUser, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
  const nameRegex = /^[А-Яа-яЁё\s]+$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !name || !password) {
      setError('Все поля обязательны для заполнения.');
      return;
    }
    if (!phoneRegex.test(phone.trim())) {
      setError('Неверный формат номера телефона. Формат: +37529 123 45 67');
      return;
    }
    if (!nameRegex.test(name.trim())) {
      setError('Имя должно содержать только буквы русского алфавита.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Пароль должен содержать не менее 6 символов.');
      return;
    }
    try {
      const data = await register({ phone: phone.trim(), name: name.trim(), password: password.trim() });
      setUser(data);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">Регистрация</div>
      <div className="auth-box">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <label>Номер телефона:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+37529 123 45 67"
            required
          />
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
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
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
