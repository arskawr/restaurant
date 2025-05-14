import React from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from './FoodCard';
import '../styles.css';

// Имитация данных для всех категорий
const sampleData = {
  salads: [
    { id: 1, name: "Салат Цезарь", price: "10$", composition: "Курица, салат, пармезан", image: "/images/cesar.jpg" },
    { id: 2, name: "Греческий", price: "12$", composition: "Оливки, фета, помидоры", image: "/images/greek.jpg" },
    { id: 3, name: "Овощной", price: "8$", composition: "Микс свежих овощей", image: "/images/vegi.jpg" },
    { id: 4, name: "Салат с креветками", price: "15$", composition: "Креветки, салат, лимон", image: "/images/photo_1_2025-05-12_17-38-58.jpg" },
  ],
  snacks: [
    { id: 11, name: "Картофель фри", price: "5$", composition: "Картофель, соль", image: "/assets/snack1.jpg" },
    { id: 22, name: "Куриные крылышки", price: "7$", composition: "Курица, соус", image: "/assets/snack2.jpg" },
    { id: 33, name: "Чесночные гренки", price: "4$", composition: "Хлеб, чеснок", image: "/images/photo_1_2025-05-12_17-36-28.jpg" },
    { id: 44, name: "Мини-буррито", price: "6$", composition: "Фасоль, лук, соус", image: "/assets/snack4.jpg" },
  ],
  "hot-dishes": [
    { id: 111, name: "Паста Болоньезе", price: "13$", composition: "Паста, мясной соус", image: "/assets/hot1.jpg" },
    { id: 222, name: "Стейк", price: "20$", composition: "Говядина, специи", image: "/assets/hot2.jpg" },
    { id: 333, name: "Пицца Маргарита", price: "12$", composition: "Томат, моцарелла", image: "/assets/hot3.jpg" },
    { id: 444, name: "Ризотто с грибами", price: "14$", composition: "Рис, грибы", image: "/assets/hot4.jpg" },
  ],
  desserts: [
    { id: 1111, name: "Тирамису", price: "8$", composition: "Маскарпоне, кофе", image: "/assets/dessert1.jpg" },
    { id: 2222, name: "Пудинг", price: "7$", composition: "Молоко, крахмал", image: "/assets/dessert2.jpg" },
    { id: 3333, name: "Мороженое", price: "5$", composition: "Сливки, фрукты", image: "/assets/dessert3.jpg" },
    { id: 4444, name: "Шоколадный торт", price: "9$", composition: "Шоколад, мука", image: "/assets/dessert4.jpg" },
  ],
};

const CategoryPage = () => {
  const { category } = useParams();
  const items = sampleData[category] || [];

  const title =
    category === "salads"
      ? "Салаты"
      : category === "snacks"
      ? "Закуски"
      : category === "hot-dishes"
      ? "Горячие блюда"
      : category === "desserts"
      ? "Дессерты"
      : "Меню";

  return (
    <div className="category-page">
      <h2 className="category-title">{title}</h2>
      <div className="food-cards">
        {items.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
