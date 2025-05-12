import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const updateCartItem = useCallback((item, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(ci => ci.id === item.id);
      if (existingItem) {
        if (quantity === 0) {
          return prevItems.filter(ci => ci.id !== item.id);
        } else {
          return prevItems.map(ci =>
            ci.id === item.id ? { ...ci, quantity } : ci
          );
        }
      } else {
        if (quantity > 0) {
          return [...prevItems, { ...item, quantity }];
        }
      }
      return prevItems;
    });
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems
      .reduce((sum, item) => {
        const priceNumber = parseFloat(item.price.replace('$', ''));
        return sum + priceNumber * item.quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, updateCartItem, getTotalPrice, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
