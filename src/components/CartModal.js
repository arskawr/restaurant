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
      navigate('/checkout');
    }
  };

  const handleQuantityChange = (item, delta) => {
    const newQuantity = Math.max(0, item.quantity + delta);
    updateCartItem(item, newQuantity);
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2 className="cart-title">Корзина кондитерских изделий</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price}р x {item.quantity}</span>
              </div>
              <div className="quantity-controls">
                <button className="decrement" onClick={() => handleQuantityChange(item, -1)}>–</button>
                <span className="quantity">{item.quantity}</span>
                <button className="increment" onClick={() => handleQuantityChange(item, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-modal-footer">
          <div className="total">Итого: {getTotalPrice()}р</div>
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