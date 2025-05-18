// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Header = ({ onCartOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo">
          <hr className="logo-line" />
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <span className="logo-text">Спатканне</span>
          </Link>
          <hr className="logo-line" />
        </div>
        <nav className="nav-menu">
          {/* Кнопка "Еще" отображается на мобильных устройствах */}
          <button className="menu-toggle" onClick={toggleMenu}>
            Еще
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li>
              <Link to="/" onClick={closeMenu}>
                Главная
              </Link>
            </li>
            <li>
              <Link to="/category/salads" onClick={closeMenu}>
                Салаты
              </Link>
            </li>
            <li>
              <Link to="/category/snacks" onClick={closeMenu}>
                Закуски
              </Link>
            </li>
            <li>
              <Link to="/category/hot-dishes" onClick={closeMenu}>
                Горячие блюда
              </Link>
            </li>
            <li>
              <Link to="/category/desserts" onClick={closeMenu}>
                Дессерты
              </Link>
            </li>
            <li>
              <Link to="/reservation" onClick={closeMenu}>
                Бронь
              </Link>
            </li>
            <li>
              <button className="cart-button" onClick={() => {
                closeMenu();
                onCartOpen();
              }}>
                Корзина
              </button>
              <Link to="/account" className="account-button">
            Аккаунт </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
