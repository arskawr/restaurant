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
        .then(res => res.json())
        .then(data => {
          setOrderHistory(data);
          setLoadingOrders(false);
        })
        .catch(err => {
          setOrdersError(err.message);
          setLoadingOrders(false);
        });
    }
  }, [user]);

  if (!user) return <div>Войдите в аккаунт</div>;

  return (
    <div className="account-page">
      <h2>Личный кабинет — Сладкий Мир</h2>
      <p>Имя: {user.name}</p>
      <p>Телефон: {user.phone}</p>
      <p>Роль: {user.role}</p>
      <button onClick={logout}>Выйти</button>

      <h2>История заказов кондитерских изделий</h2>
      if (loadingOrders) <p>Загрузка...</p>
      if (ordersError) <p>Ошибка: {ordersError}</p>
      {orderHistory.length > 0 ? (
        <div className="order-history">
          {orderHistory.map(order => (
            <div key={order.id} className="order-item">
              <p><strong>Заказ ID:</strong> {order.id}</p>
              <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Итого:</strong> {order.total}</p>
              <p><strong>Заказ:</strong> {order.items}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Заказов пока нет.</p>
      )}
      {user.role === 'admin' && (
        <div className="admin-panel-link">
          <h2>Панель администратора</h2>
          <Link to="/admin" className="admin-link">Редактировать ассортимент</Link>
        </div>
      )}
    </div>
  );
};

export default AccountPage;