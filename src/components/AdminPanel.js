// src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import '../styles.css';

const AdminPanel = () => {
  // Доступные категории
  const categories = [
    { value: 'salads', label: 'Салаты' },
    { value: 'snacks', label: 'Закуски' },
    { value: 'hot-dishes', label: 'Горячие блюда' },
    { value: 'desserts', label: 'Десерты' },
  ];

  const [menuItems, setMenuItems] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '', category: 'salads' });

  // Загружаем блюда с сервера при монтировании
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      } else {
        console.error("Ошибка при загрузке меню:", res.statusText);
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  const handleEdit = (item) => {
    setEditedItem({ ...item });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem)
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        setEditedItem(null);
      } else {
        const errorData = await res.json();
        alert("Ошибка обновления: " + errorData.error);
      }
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedItem(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      } else {
        const errorData = await res.json();
        alert("Ошибка удаления: " + errorData.error);
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      alert('Заполните все поля для нового блюда.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const addedItem = await res.json();
        setMenuItems([...menuItems, addedItem]);
        setNewItem({ name: '', price: '', image: '', category: 'salads' });
      } else {
        const errorData = await res.json();
        alert("Ошибка добавления: " + errorData.error);
      }
    } catch (error) {
      console.error("Ошибка при добавлении блюда:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>
      <h2>Редактирование меню</h2>
      <div className="menu-items-list">
        <table className="menu-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Категория</th>
              <th>Изображение</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {editedItem && editedItem.id === item.id ? (
                    <input
                      type="text"
                      value={editedItem.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editedItem && editedItem.id === item.id ? (
                    <input
                      type="text"
                      value={editedItem.price}
                      onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                    />
                  ) : (
                    item.price
                  )}
                </td>
                <td>
                  {editedItem && editedItem.id === item.id ? (
                    <select
                      value={editedItem.category}
                      onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    categories.find(cat => cat.value === item.category)?.label || item.category
                  )}
                </td>
                <td>
                  {editedItem && editedItem.id === item.id ? (
                    <input
                      type="text"
                      value={editedItem.image}
                      onChange={(e) => setEditedItem({ ...editedItem, image: e.target.value })}
                    />
                  ) : (
                    <img src={item.image} alt={item.name} className="admin-item-img" />
                  )}
                </td>
                <td>
                  {editedItem && editedItem.id === item.id ? (
                    <>
                      <button onClick={handleSaveEdit}>Сохранить</button>
                      <button onClick={handleCancelEdit}>Отмена</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)}>Редактировать</button>
                      <button onClick={() => handleDelete(item.id)}>Удалить</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Форма для добавления нового блюда */}
      <div className="add-menu-item">
        <h3>Добавить блюдо</h3>
        <div className="add-menu-item-form">
          <input
            type="text"
            placeholder="Название блюда"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Цена"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <button onClick={handleAddItem}>Добавить блюдо</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
