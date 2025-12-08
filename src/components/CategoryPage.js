// src/components/CategoryPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from './FoodCard';
import '../styles.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // При монтировании делаем запрос к API для получения актуальных блюд
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menu'); // прокси в package.json перенаправит запрос на порт 5000
        if (!res.ok) {
          throw new Error(`Ошибка: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
        console.error("Ошибка при получении меню:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Фильтруем блюда по выбранной категории
  const filteredItems = menuItems.filter(item => item.category === category);

  // Определяем заголовок в зависимости от категории
 const title = {
  cakes: "Торты",
  pastries: "Пирожные",
  marshmallow: "Зефир и пастила",
  chocolate: "Шоколадные конфеты"
}[category] || "Ассортимент";

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="category-page">
      <h2 className="category-title">{title}</h2>
      <div className="food-cards">
        {filteredItems.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
