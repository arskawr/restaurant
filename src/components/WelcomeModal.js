import React from 'react';
import '../styles.css';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="cart-modal-overlay"> {/* Переиспользуем overlay для затемнения */}
      <div className="cart-modal"> {/* Основное окно модалки */}
        <h2>Добро пожаловать в систему автоматизации кондитерской фабрики "Сладкий Мир"</h2>
        <p>
          Это клиентское приложение позволяет просматривать ассортимент продукции,<br />
          оформлять розничные заказы и отправлять оптовые заявки.
        </p>
        <p>Для администраторов доступна панель управления ассортиментом.</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '10px 30px', fontSize: '18px' }}>
            Начать работу
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;