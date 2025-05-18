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
    { id: 11, name: "Картофель фри", price: "5$", composition: "Картофель, соль", image: "https://yapiko.com.ua/media/catalog/product/cache/90c631851bfc82ed3538a672fa9488bb/9/1/910_500_151_1.jpg" },
    { id: 22, name: "Куриные крылышки", price: "7$", composition: "Курица, соус", image: "https://static1-repo.aif.ru/1/20/2077912/a683db13f163616995ee0900004e2e31.jpg" },
    { id: 33, name: "Чесночные гренки", price: "4$", composition: "Хлеб, чеснок", image: "https://img.iamcook.ru/2017/upl/recipes/cat/u6009-8370488359932aea417140713ee674aa.JPG" },
    { id: 44, name: "Мини-буррито", price: "6$", composition: "Фасоль, лук, соус", image: "https://the-wedding.ru/upload/photo/CompanyRestaurant/184682/mini_tako_s_utkoy_evetkoy.jpg" },
  ],
  "hot-dishes": [
    { id: 111, name: "Паста Болоньезе", price: "13$", composition: "Паста, мясной соус", image: "https://www.desetka.co.me/wp-content/uploads/2020/05/pasta-bolognese-scaled.jpg" },
    { id: 222, name: "Стейк", price: "20$", composition: "Говядина, специи", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/8d/b1/a7/caption.jpg?w=900&h=500&s=1" },
    { id: 333, name: "Пицца Маргарита", price: "12$", composition: "Томат, моцарелла", image: "https://buonamici.rest/wp-content/uploads/49_11zon.webp" },
    { id: 444, name: "Ризотто с грибами", price: "14$", composition: "Рис, грибы", image: "https://images.gastronom.ru/3H5SKK6-5AGSXlGdPcbCaYG_E9ZLx63nnwit0pGq7H4/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzVjOTUwODYxLThmZjctNGY5MC05MjA4LTM4MjczNDdiZWNjYy5qcGc.webp" },
  ],
  desserts: [
    { id: 1111, name: "Тирамису", price: "8$", composition: "Маскарпоне, кофе", image: "https://reston.ua/images/img/tiramisu.jpg" },
    { id: 2222, name: "Пудинг", price: "7$", composition: "Молоко, крахмал", image: "https://images.squarespace-cdn.com/content/v1/5dd7af46aebbdd27118de11f/1602075051277-WBDKDAYSY4FU8KWIB9ND/Wedgwood-Restaurant-Recipe-Sticky-toffee-pudding-Caol-Ila-butterscotch-vanilla-ice-cream-medium.jpg" },
    { id: 3333, name: "Мороженое", price: "5$", composition: "Сливки, фрукты", image: "https://barashek.kg/wp-content/uploads/2022/11/Morozhenoe.jpeg" },
    { id: 4444, name: "Шоколадный торт", price: "9$", composition: "Шоколад, мука", image: "https://sedelice.ru/uploads/blog/74/original.jpg?_=4117107315" },
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
