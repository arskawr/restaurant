// src/components/AccountPage.js

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

const AccountPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/orders/${user.id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setOrderHistory(data);
          setLoadingOrders(false);
        })
        .catch((error) => {
          setOrdersError(error.message);
          setLoadingOrders(false);
        });
    }
  }, [user]);

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
        {loadingOrders ? (
          <p>Загрузка истории заказов...</p>
        ) : ordersError ? (
          <p>Ошибка: {ordersError}</p>
        ) : orderHistory.length ? (
          <div className="card-container">
            {orderHistory.map((order) => {
              let orderDisplay = "";
              try {
                const parsedItems = JSON.parse(order.items);
                // Собираем только названия блюд
                orderDisplay = parsedItems.map(item => item.name).join(', ');
              } catch(err) {
                orderDisplay = order.items;
              }
              return (
                <div key={order.id} className="card">
                  <h3>Заказ #{order.id}</h3>
                  <p>
                    <strong>Дата:</strong>{' '}
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </p>
                  <p><strong>Итого:</strong> {order.total}</p>
                  <p><strong>Заказ:</strong> {orderDisplay}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Заказов пока нет.</p>
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
