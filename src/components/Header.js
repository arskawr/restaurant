// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';


const Header = ({ onCartOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo">
          <hr className="logo-line" />
          <Link to="/" className="logo-link">
            <span className="logo-text">Сладкий Мир</span>
          </Link>
          <hr className="logo-line" />
        </div>
        <nav className="nav-menu">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            Меню
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/category/cakes">Торты</Link></li>
            <li><Link to="/category/pastries">Пирожные</Link></li>
            <li><Link to="/category/marshmallow">Зефир</Link></li>
            <li><Link to="/category/chocolate">Шоколад</Link></li>
            <li><Link to="/wholesale">ОптОптовый заказ</Link></li>
            <li><button className="cart-button" onClick={onCartOpen}>Корзина</button></li>
            <li><Link to="/account">Аккаунт</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;
