import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://webredox.net/demo/wp/candore/wp-content/uploads/2023/01/banner12-1.jpg')",
        }}
      >
        <div className="hero-overlay">
          <h1>Изысканные блюда в Спатканне</h1>
          <p>Сделайте заказ в два клика и наслаждайтесь высоким сервисом</p>
        </div>
      </section>

      {/* Меню — блок с категориями */}
      <section className="menu-block">
        <h2>Меню</h2>
        <div className="menu-items">
          <Link
            to="/category/salads"
            className="menu-item"
            style={{
              backgroundImage:
                "url('https://barashek.kg/wp-content/uploads/2020/11/Svekolnyj-salat-s-syrom-burrata.-Ovoshhnye.-Salaty..jpg')",
            }}
          >
            <span>Салаты</span>
          </Link>
          <Link
            to="/category/snacks"
            className="menu-item"
            style={{
              backgroundImage:
                "url('/images/photo_2025-05-12_17-36-35.jpg')",
            }}
          >
            <span>Закуски</span>
          </Link>
          <Link
            to="/category/hot-dishes"
            className="menu-item"
            style={{
              backgroundImage:
                "url('https://club.mysamson.ru/upload/iblock/567/vmu1kmem84noqq4k9i7rm92ju96jevhw.webp')",
            }}
          >
            <span>Горячие блюда</span>
          </Link>
          <Link
            to="/category/desserts"
            className="menu-item"
            style={{
              backgroundImage:
                "url('/images/photo_1_2025-05-12_17-36-28.jpg')",
            }}
          >
            <span>Дессерты</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
