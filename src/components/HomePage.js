import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: "url('/assets/hero.jpg')" }}  // Укажите правильный путь к вашему изображению
      >
        <div className="hero-overlay">
          <h1>Изысканные блюда в Спатканне</h1>
          <p>Сделайте заказ в два клика и наслаждайтесь высоким сервисом</p>
        </div>
      </section>

      {/* Menu Block */}
      <section className="menu-block">
        <h2>Меню</h2>
        <div className="menu-items">
          <Link to="/category/salads" className="menu-item">
            <span>Салаты</span>
          </Link>
          <Link to="/category/hot-dishes" className="menu-item">
            <span>Горячие блюда</span>
          </Link>
          <Link to="/category/snacks" className="menu-item">
            <span>Закуски</span>
          </Link>
          <Link to="/category/desserts" className="menu-item">
            <span>Дессерты</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
