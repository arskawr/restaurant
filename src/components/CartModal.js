// src/components/CartModal.js

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const CartModal = ({ onClose }) => {
  const { cartItems, updateCartItem, getTotalPrice } = useContext(CartContext);
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setWarning('Ваша корзина пуста');
    } else {
      setWarning('');
      onClose();
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Корзина</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-modal-content">
          {cartItems.length === 0 ? (
            <p>Ваша корзина пуста.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div
                  className="cart-item-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <div className="cart-item-controls">
                    <button
                      className="decrement"
                      onClick={() => updateCartItem(item, item.quantity - 1)}
                    >
                      –
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="increment"
                      onClick={() => updateCartItem(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-price">
                    {item.price} x {item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-modal-footer">
          <div className="total">Итого: {getTotalPrice()}$</div>
          {/* Выводим предупреждение, если оно есть */}
          {warning && <p className="warning-message">{warning}</p>}
          <button className="checkout-button" onClick={handleCheckout}>
            Заказать
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
