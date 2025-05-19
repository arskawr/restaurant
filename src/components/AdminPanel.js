// src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import '../styles.css';

const AdminPanel = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error("Ошибка получения меню:", err));
  }, []);

  const handleEdit = item => {
    setEditedItem({ ...item });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/menu/${editedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
      const updatedItem = await res.json();
      setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEditedItem(null);
    } catch (err) {
      console.error("Ошибка при обновлении блюда:", err);
      setError("Ошибка при обновлении блюда.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении блюда:", err);
      setError("Ошибка при удалении блюда.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="menu-list">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item">
            {editedItem && editedItem.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={e => setEditedItem({ ...editedItem, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editedItem.price}
                  onChange={e => setEditedItem({ ...editedItem, price: e.target.value })}
                />
                <input
                  type="text"
                  value={editedItem.image}
                  onChange={e => setEditedItem({ ...editedItem, image: e.target.value })}
                />
                <input
                  type="text"
                  value={editedItem.category}
                  onChange={e => setEditedItem({ ...editedItem, category: e.target.value })}
                />
                <input
                  type="text"
                  value={editedItem.composition || ''}
                  onChange={e => setEditedItem({ ...editedItem, composition: e.target.value })}
                />
                <button onClick={handleSaveEdit}>Сохранить</button>
                <button onClick={() => setEditedItem(null)}>Отмена</button>
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.price}</p>
                <img src={item.image} alt={item.name} style={{width: '100px'}}/>
                <p>{item.category}</p>
                <p>{item.composition}</p>
                <button onClick={() => handleEdit(item)}>Редактировать</button>
                <button onClick={() => handleDelete(item.id)}>Удалить</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
