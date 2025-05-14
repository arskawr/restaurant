// src/components/ReservationPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTimePicker from './CustomTimePicker';
import '../styles.css';

const ReservationPage = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00'); // значение по умолчанию
  const [people, setPeople] = useState(1);
  const [error, setError] = useState('');
  const [reservationPlaced, setReservationPlaced] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const nameRegex = /^[А-Яа-яЁё\s]+$/;
    const phoneRegex = /^\+375\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

    if (!nameRegex.test(lastName.trim())) {
      setError('Фамилия должна содержать только буквы.');
      return false;
    }
    if (!nameRegex.test(firstName.trim())) {
      setError('Имя должно содержать только буквы.');
      return false;
    }
    if (!phoneRegex.test(phone.trim())) {
      setError('Неправильный формат номера телефона.');
      return false;
    }
    if (!date) {
      setError('Выберите дату.');
      return false;
    }
    if (!time) {
      setError('Выберите время.');
      return false;
    }
    const now = new Date();
    const reservationDateTime = new Date(`${date}T${time}`);
    if (reservationDateTime <= now) {
      setError('Дата и время бронирования должны быть в будущем.');
      return false;
    }
    if (people < 1 || people > 30) {
      setError('Количество человек должно быть от 1 до 30.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    setError('');
    setReservationPlaced(true);
    // Здесь можно добавить вызов API для бронирования
  };

  const handleMainButton = () => {
    setReservationPlaced(false);
    navigate('/');
  };

  return (
    <div
      className="reservation-page"
      style={{
        
      }}
    >
      <h1>Бронирование столика</h1>
      <div className="reservation-container">
        <div className="reservation-form">
          <h2>Введите ваши данные</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Фамилия:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ваша фамилия"
                required
              />
            </div>
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div className="form-group">
              <label>Номер телефона:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+375 29 815 47 51"
                required
              />
            </div>
            <div className="form-group">
              <label>Дата:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Время:</label>
              <CustomTimePicker value={time} onChange={setTime} />
            </div>
            <div className="form-group">
              <label>Количество человек:</label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                min="1"
                max="30"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-order">
              Забронировать
            </button>
          </form>
        </div>
      </div>
      {reservationPlaced && (
        <div className="reservation-confirmation-overlay">
          <div className="reservation-confirmation-modal">
            <p>Ваша бронь оформлена</p>
            <button className="main-button" onClick={handleMainButton}>
              Главная
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
