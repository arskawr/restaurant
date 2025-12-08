import React, { createContext, useState, useEffect } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      } else {
        console.error('Ошибка API:', res.status);
      }
    } catch (error) {
      console.error('Ошибка при получении меню:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const updateMenu = () => fetchMenuItems();

  return (
    <MenuContext.Provider value={{ menuItems, loading, updateMenu, setMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
};