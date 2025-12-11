import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const HomePage = () => {
  return (
    <div>
      <section className="hero" style={{ backgroundImage: "url('C:\Users\арс\OneDrive\Рабочий стол\курсовая\vid-speredi-sokoladnyi-keks-s-kakao-poroskom-i-kopiei-prostranstva.jpg')" }}>
        <div className="hero-overlay">
          <h1>Сладкий Мир — Кондитерская фабрика</h1>
          <p>Свежие торты, пирожные и конфеты с производства</p>
        </div>
      </section>

      <section className="menu-block">
        <h2 className="centered-title">Ассортимент</h2>
        <div className="centered-menu menu-items">
          <Link to="/category/cakes" className="menu-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800')" }}>
            <span>Торты</span>
          </Link>
          <Link to="/category/pastries" className="menu-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558326569-68034e9b9efa?w=800')" }}>
            <span>Пирожные</span>
          </Link>
          <Link to="/category/marshmallow" className="menu-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622621722311-3d5e28e6b94d?w=800')" }}>
            <span>Зефир</span>
          </Link>
          <Link to="/category/chocolate" className="menu-item" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548907042-5975c4e6e8c8?w=800')" }}>
            <span>Шоколад</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;