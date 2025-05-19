// src/components/CheckoutPage.js

import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  // Функция проверки входных данных
  const validateInputs = () => {
    const nameRegex = /^[А-Яа-яЁё\s]+$/;
    const addressRegex = /^[А-Яа-яA-Za-z0-9\s.,/-]+$/;
    const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    if (!nameRegex.test(name.trim())) return false;
    if (!addressRegex.test(address.trim())) return false;
    if (!phoneRegex.test(phone.trim())) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError('Ваша корзина пуста.');
      return;
    }
    if (!validateInputs()) {
      setError('Неправильно введены данные.');
      return;
    }
    if (!user) {
      setError('Пожалуйста, войдите в систему для оформления заказа.');
      return;
    }
    setError('');

    try {
      // ВНИМАНИЕ: запрос отправляется на "/api/orders" – без дополнительного сегмента userId!
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: cartItems,
          total: getTotalPrice()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка при оформлении заказа.');
        return;
      }
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      setError('Ошибка при оформлении заказа.');
    }
  };

  const handleMainButton = () => {
    setOrderPlaced(false);
    navigate('/');
  };

  return (
    <div className="checkout-page">
      <h1>Оформление заказа</h1>
      <div className="checkout-container">
        {/* Блок с заказанными блюдами */}
        <div className="order-summary">
          <h2>Ваш заказ</h2>
          {cartItems.length === 0 ? (
            <p>Ваша корзина пуста.</p>
          ) : (
            <div className="order-items-block">
              {cartItems.map(item => (
                <div key={item.id} className="order-summary-item">
                  <div
                    className="order-item-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <div className="order-item-details">
                    <p>{item.name}</p>
                    <p>
                      {item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div className="order-total">Итого: {getTotalPrice()}</div>
            </div>
          )}
        </div>

        {/* Форма для ввода данных доставки */}
        <div className="order-form">
          <h2>Введите ваши данные</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div className="form-group">
              <label>Адрес:</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Улица, дом, квартира"
                required
              />
            </div>
            <div className="form-group">
              <label>Номер телефона:</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+375 29 815 47 51"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-order">
              Оформить заказ
            </button>
          </form>
        </div>
      </div>
      {orderPlaced && (
        <div className="order-confirmation-overlay">
          <div className="order-confirmation-modal">
            <p>Ваш заказ оформлен</p>
            <p>Ожидайте заказ в течение 1ч20мин</p>
            <button className="main-button" onClick={handleMainButton}>
              Главная
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
