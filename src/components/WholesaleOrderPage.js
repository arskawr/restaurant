import React, { useState } from 'react';
import '../styles.css';

const WholesaleOrderPage = () => {
  const [formData, setFormData] = useState({
    company: '', phone: '', email: '', volume: '', comment: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="reservation-container">
      <h2>Оптовый заказ</h2>
      <p>Для кафе, магазинов, корпоративов</p>
      {success ? (
        <div className="order-confirmation-modal">
          <p>Заявка отправлена!</p>
          <p>Менеджер свяжется с вами в течение часа</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input placeholder="Название компании" required 
            onChange={e => setFormData({...formData, company: e.target.value})} />
          <input placeholder="Телефон" required 
            onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="email" placeholder="Email" required 
            onChange={e => setFormData({...formData, email: e.target.value})} />
          <textarea placeholder="Объём заказа, ассортимент..." rows="4"
            onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
          <button type="submit">Отправить заявку</button>
        </form>
      )}
    </div>
  );
};

export default WholesaleOrderPage;