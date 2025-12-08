import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const WholesaleOrderPage = () => {
  const [formData, setFormData] = useState({
    company: '',
    phone: '',
    email: '',
    volume: '',
    comment: ''
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить fetch на /api/wholesale, но для простоты — просто успех
    setSuccess(true);
  };

  const handleMainButton = () => navigate('/');

  return (
    <div className="reservation-container centered">
      <h2>Оптовый заказ</h2>
      <p>Для кафе, магазинов и мероприятий</p>
      {success ? (
        <div className="order-confirmation-modal">
          <p>Заявка отправлена!</p>
          <p>Менеджер свяжется в течение часа</p>
          <button className="main-button" onClick={handleMainButton}>Главная</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Компания:</label>
            <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
          </div>
          <div>
            <label>Телефон:</label>
            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label>Объём (кг):</label>
            <input type="number" value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} required />
          </div>
          <div>
            <label>Комментарий:</label>
            <textarea value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} rows="4" />
          </div>
          <button type="submit" className="submit-order">Отправить</button>
        </form>
      )}
    </div>
  );
};

export default WholesaleOrderPage;