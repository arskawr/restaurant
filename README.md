# Сладкий Мир — Кондитерская фабрика

Это сетевое приложение для автоматизации работы кондитерской фабрики. Адаптировано из restaurant-app.

## Установка

1. `npm install`
2. Создай .env с DATABASE_URL (Neon DB)
3. `npm run build` для React
4. `npm start` для сервера
5. Для оконного клиента: `npm run electron-start`

## Описание

- Клиент: Оконный интерфейс через Electron (React внутри).
- Сервер: Express с API для меню, заказов, аутентификации.
- БД: Neon (PostgreSQL).