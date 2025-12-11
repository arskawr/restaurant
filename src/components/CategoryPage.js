import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from './FoodCard.js';
import { MenuContext } from '../context/MenuContext.js';
import '../styles.css';

const CategoryPage = () => {
  const { category } = useParams();
  const { menuItems, loading } = useContext(MenuContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (menuItems.length === 0) {
      setError('Меню загружается...');
    } else {
      setError(null);
    }
  }, [menuItems]);

  const filteredItems = menuItems.filter(item => item.category === category);

  const title = 
    category === "cakes" ? "Торты" :
    category === "pastries" ? "Пирожные" :
    category === "marshmallow" ? "Зефир и пастила" :
    category === "chocolate" ? "Шоколадные конфеты" : "Ассортимент";

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="category-page">
      <h2 className="category-title">{title}</h2>
      <div className="food-cards">
        {filteredItems.length === 0 ? (
          <p>В этой категории пока нет товаров.</p>
        ) : (
          filteredItems.map(item => <FoodCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default CategoryPage;