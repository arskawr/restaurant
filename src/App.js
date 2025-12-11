import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';
import WholesaleOrderPage from './components/WholesaleOrderPage';
import CartModal from './components/CartModal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AccountPage from './components/AccountPage';
import AdminPanel from './components/AdminPanel';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
 

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const [showWelcome, setShowWelcome] = useState(true);

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