// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Header = ({ onCartOpen }) => {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo">
          <hr className="logo-line" />
          <Link to="/" className="logo-link">
            <span className="logo-text">Спатканне</span>
          </Link>
          <hr className="logo-line" />
        </div>
        <nav className="nav-menu">
          <Link to="/">Главная</Link>
          <Link to="/category/salads">Салаты</Link>
          <Link to="/category/snacks">Закуски</Link>
          <Link to="/category/hot-dishes">Горячие блюда</Link>
          <Link to="/category/desserts">Дессерты</Link>
          <Link to="/reservation">Бронь</Link>
          <button className="cart-button" onClick={onCartOpen}>Корзина</button>
          
        </nav>
      </div>
    </header>
  );
};

export default Header;
