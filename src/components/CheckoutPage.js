import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!name.trim()) return setError('Имя обязательно');
    if (!address.trim()) return setError('Адрес обязателен');
    if (!phone.trim()) return setError('Телефон обязателен');
    if (cartItems.length === 0) return setError('Корзина пуста');
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const itemsStr = cartItems.map(item => `${item.name} x${item.quantity}`).join(', ');
      const total = getTotalPrice();

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, items: itemsStr, total }),
      });

      if (!res.ok) throw new Error('Ошибка сохранения заказа');

      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMainButton = () => navigate('/');

  if (!user) return <div>Войдите в аккаунт для заказа</div>;

  return (
    <div className="checkout-container">
      <h2>Оформление заказа кондитерских изделий</h2>
      <div className="checkout-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Имя:</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label>Адрес доставки:</label>
            <input value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div>
            <label>Телефон:</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-order">Оформить</button>
        </form>
      </div>
      {orderPlaced && (
        <div className="order-confirmation-overlay">
          <div className="order-confirmation-modal">
            <p>Заказ №{orderId} принят в производство!</p>
            <p>Срок: 1–3 дня</p>
            <button className="main-button" onClick={handleMainButton}>Главная</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;