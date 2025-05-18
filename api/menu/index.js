// api/menu/index.js

// Минимальный пример: возвращаем тестовый JSON с данными меню.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  // Здесь можно реализовать подключение к базе и выборку записей
  // Для проверки отправляем тестовый ответ:
  const testMenu = [
    { id: 5, name: "Салат Цезарь", price: 10.00, image: "/images/cesar.jpg", category: "salads", composition: "Ромэн • Гриль куриная грудка • Сухарики • Пармезан • Соус Цезарь ..." },
    { id: 6, name: "Греческий", price: 12.00, image: "/images/greek.jpg", category: "salads", composition: "Помидоры • Огурцы • Красный лук ..." }
    // … остальные записи
  ];
  
  res.status(200).json(testMenu);
}
