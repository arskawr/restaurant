import React, { useState, useEffect } from 'react';
import '../styles.css';

const AdminPanel = () => {
  const categories = [
    { value: 'cakes', label: 'Торты' },
    { value: 'pastries', label: 'Пирожные' },
    { value: 'marshmallow', label: 'Зефир и пастила' },
    { value: 'chocolate', label: 'Шоколадные конфеты' },
  ];

  const [menuItems, setMenuItems] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image: '',
    category: 'cakes',
    composition: '',
  });

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleEditItem = (item) => {
    setEditedItem(item);
  };

  const handleUpdateItem = async () => {
    try {
      await fetch(`/api/menu/${editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem),
      });
      fetchMenuItems();
      setEditedItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchMenuItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async () => {
    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      fetchMenuItems();
      setNewItem({ name: '', price: '', image: '', category: 'cakes', composition: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Панель администратора кондитерской фабрики</h2>
      <div className="menu-list">
        <h3>Ассортимент изделий</h3>
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">
            <p>Название: {item.name}</p>
            <p>Цена: {item.price}</p>
            <p>Категория: {categories.find(c => c.value === item.category)?.label}</p>
            <p>Состав: {item.composition}</p>
            <button onClick={() => handleEditItem(item)}>Редактировать</button>
            <button onClick={() => handleDeleteItem(item.id)}>Удалить</button>
          </div>
        ))}
      </div>
      {editedItem && (
        <div className="edit-form">
          <h3>Редактировать изделие</h3>
          <input value={editedItem.name} onChange={e => setEditedItem({...editedItem, name: e.target.value})} />
          <input value={editedItem.price} onChange={e => setEditedItem({...editedItem, price: e.target.value})} />
          <input value={editedItem.image} onChange={e => setEditedItem({...editedItem, image: e.target.value})} />
          <select value={editedItem.category} onChange={e => setEditedItem({...editedItem, category: e.target.value})}>
            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
          <input value={editedItem.composition} onChange={e => setEditedItem({...editedItem, composition: e.target.value})} />
          <button onClick={handleUpdateItem}>Сохранить</button>
        </div>
      )}
      <div className="add-form">
        <h3>Добавить новое изделие</h3>
        <input placeholder="Название" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
        <input placeholder="Цена" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
        <input placeholder="URL изображения" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
        <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
          {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
        </select>
        <input placeholder="Состав" value={newItem.composition} onChange={e => setNewItem({...newItem, composition: e.target.value})} />
        <button onClick={handleAddItem}>Добавить</button>
      </div>
    </div>
  );
};

export default AdminPanel;