import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import HomePage from './components/HomePage.js';
import CategoryPage from './components/CategoryPage.js';
import CheckoutPage from './components/CheckoutPage.js';
import WholesaleOrderPage from './components/WholesaleOrderPage.js';
import CartModal from './components/CartModal.js';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';
import AccountPage from './components/AccountPage.js';
import AdminPanel from './components/AdminPanel.js';
import { CartProvider } from './context/CartContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { MenuProvider } from './context/MenuContext.js';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <AuthProvider>
      <CartProvider>
        <MenuProvider>
          <Router>
            <Header onCartOpen={openCart} />
            {isCartOpen && <CartModal onClose={closeCart} />}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wholesale" element={<WholesaleOrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </div>
          </Router>
        </MenuProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;