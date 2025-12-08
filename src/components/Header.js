import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Header = ({ onCartOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo">
          <hr className="logo-line" />
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <span className="logo-text">Сладкий Мир</span>
          </Link>
          <hr className="logo-line" />
        </div>
        <nav className="nav-menu">
          <button className="menu-toggle" onClick={toggleMenu}>Меню</button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link to="/" onClick={closeMenu}>Главная</Link></li>
            <li><Link to="/category/cakes" onClick={closeMenu}>Торты</Link></li>
            <li><Link to="/category/pastries" onClick={closeMenu}>Пирожные</Link></li>
            <li><Link to="/category/marshmallow" onClick={closeMenu}>Зефир</Link></li>
            <li><Link to="/category/chocolate" onClick={closeMenu}>Шоколад</Link></li>
            <li><Link to="/wholesale" onClick={closeMenu}>Опт</Link></li>
            <li><button className="cart-button" onClick={() => { closeMenu(); onCartOpen(); }}>Корзина</button></li>
            <li><Link to="/account" className="account-button" onClick={closeMenu}>Аккаунт</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;