// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';
import ReservationPage from './components/ReservationPage';
import CartModal from './components/CartModal';
import { CartProvider } from './context/CartContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartProvider>
      <Router>
        <Header onCartOpen={openCart} />
        {isCartOpen && <CartModal onClose={closeCart} />}
        <div style={{ paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
