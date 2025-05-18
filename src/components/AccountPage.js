// src/components/AccountPage.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

const AccountPage = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="account-page">
        <h2>Вы не авторизованы</h2>
        <div className="auth-links">
          <Link to="/login" className="auth-link">Войти</Link>
          <span> / </span>
          <Link to="/register" className="auth-link">Зарегистрироваться</Link>
        </div>
      </div>
    );
  }

  // Фиктивные данные для истории заказов и бронирований
  const orderHistory = [
    { id: 1, date: '2023-10-01', total: '25$', items: ['Блюдо 1', 'Блюдо 2'] },
    { id: 2, date: '2023-10-12', total: '40$', items: ['Блюдо 3', 'Блюдо 4'] },
  ];

  const reservations = [
    { id: 1, date: '2023-11-01', time: '19:00', table: 4 },
  ];

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>Личный кабинет</h1>
        <div className="user-info">
          <p>Привет, {user.name}!</p>
          <button onClick={logout} className="logout-button">Выйти</button>
        </div>
      </div>

      <div className="account-section">
        <h2>История заказов</h2>
        {orderHistory.length ? (
          <div className="card-container">
            {orderHistory.map(order => (
              <div key={order.id} className="card">
                <h3>Заказ #{order.id}</h3>
                <p><strong>Дата:</strong> {order.date}</p>
                <p><strong>Итого:</strong> {order.total}</p>
                <p><strong>Блюда:</strong> {order.items.join(', ')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Заказов пока нет.</p>
        )}
      </div>

      <div className="account-section">
        <h2>Бронирования</h2>
        {reservations.length ? (
          <div className="card-container">
            {reservations.map(res => (
              <div key={res.id} className="card">
                <h3>Бронирование #{res.id}</h3>
                <p><strong>Дата:</strong> {res.date}</p>
                <p><strong>Время:</strong> {res.time}</p>
                <p><strong>Столик:</strong> {res.table}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Бронирований пока нет.</p>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="admin-panel-link">
          <h2>Панель администратора</h2>
          <Link to="/admin" className="admin-link">Редактировать меню</Link>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
