// src/components/FoodCard.js

import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles.css';
import cartIcon from './cart.png'; // Ваш значок корзины

const FoodCard = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const { updateCartItem } = useContext(CartContext);

  // Обновляем корзину при изменении количества
  useEffect(() => {
    updateCartItem(item, quantity);
  }, [item, quantity, updateCartItem]);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setQuantity(1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(0);
    }
  };

  return (
    <div className="food-card">
      <div
        className="food-image"
        style={{ backgroundImage: `url(${item.image})` }}
      ></div>
      <div className="food-details">
        <h3>{item.name}</h3>
        <p className="food-price">{item.price}</p>
        <p className="food-composition">{item.composition}</p>
        {quantity === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={handleAddClick}
            aria-label="Добавить в корзину"
          >
            <img src={cartIcon} alt="Корзина" className="cart-icon" />
          </button>
        ) : (
          <div className="quantity-controls">
            <button className="decrement" onClick={handleDecrement}>
              –
            </button>
            <span className="quantity">{quantity}</span>
            <button className="increment" onClick={handleIncrement}>
              +
            </button>
            <button className="added" disabled>
              Добавлено
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
