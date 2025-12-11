import React from 'react';
import { useEffect, useState } from 'react';

const ServerGUI = () => {
  const [serverInfo, setServerInfo] = useState('');

  useEffect(() => {
    // Симулируем серверное окно с инфо
    setServerInfo('Сервер фабрики запущен. Подключено пользователей: 4\nРедактирование ассортимента доступно.');
  }, []);

  return (
    <div className="server-gui">
      <h2>Серверное окно кондитерской фабрики</h2>
      <p>{serverInfo}</p>
      <button onClick={() => alert('Редактирование товаров')}>Редактировать ассортимент</button>
    </div>
  );
};

export default ServerGUI;