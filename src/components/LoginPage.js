import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const LoginPage = () => {
  const { login } from useContext(AuthContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ phone, password });
      navigate('/account');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Вход в систему кондитерской фабрики</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+37529 123 45 67" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;