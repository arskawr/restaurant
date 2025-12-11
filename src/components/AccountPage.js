import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import '../styles.css';

const AccountPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/${user.id}`)
        .then(res => res.json())
        .then(data => setOrderHistory(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="centered">
        <h2>Войдите в аккаунт</h2>
        <Link to="/login">Войти</Link> | <Link to="/register">Регистрация</Link>
      </div>
    );
  }

  return (
    <div className="centered">
      <h2>Личный кабинет</h2>
      <p>Привет, {user.name}!</p>
      <button onClick={logout}>Выйти</button>
      <h3>История заказов</h3>
      {loading ? <p>Загрузка...</p> : orderHistory.length === 0 ? <p>Нет заказов</p> : (
        orderHistory.map(order => (
          <div key={order.id}>
            <p>Заказ №{order.id} от {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Сумма: {order.total}р</p>
          </div>
        ))
      )}
      {user.role === 'admin' && <Link to="/admin">Админ-панель</Link>}
    </div>
  );
};

export default AccountPage;