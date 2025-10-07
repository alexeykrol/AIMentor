import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Plus, ShoppingCart, Check, X, Star, User, Calendar, DollarSign } from 'lucide-react';

// Типы данных
interface LibraryPrompt {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  author: string;
  rating: number;
  reviewsCount: number;
  price: number; // 0 для бесплатных
  isFree: boolean;
  createdAt: string;
  tags: string[];
  content: string;
  instructions: string;
  isAdded: boolean; // добавлен ли в личную библиотеку
  isPurchased: boolean; // куплен ли (для платных)
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// Mock данные категорий
const MOCK_CATEGORIES: Category[] = [
  { id: 'all', name: 'Все категории', count: 24 },
  { id: 'added', name: 'Добавлено', count: 2 },
  { id: 'writing', name: 'Написание текстов', count: 8 },
  { id: 'coding', name: 'Программирование', count: 6 },
  { id: 'analysis', name: 'Анализ данных', count: 4 },
  { id: 'creative', name: 'Креативность', count: 3 },
  { id: 'business', name: 'Бизнес', count: 3 },
];

// Mock данные промптов
const MOCK_PROMPTS: LibraryPrompt[] = [
  {
    id: 'prompt-1',
    title: 'Копирайтер для соцсетей',
    description: 'Создает вирусные посты для Instagram, Facebook, TikTok',
    fullDescription: 'Профессиональный промпт для создания вирусного контента в социальных сетях. Учитывает особенности каждой платформы, тренды и психологию аудитории.',
    category: 'writing',
    author: 'MarketingPro',
    rating: 4.8,
    reviewsCount: 127,
    price: 0,
    isFree: true,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['соцсети', 'копирайтинг', 'маркетинг'],
    content: 'Ты профессиональный копирайтер для социальных сетей. Создавай вирусные посты, которые привлекают внимание и генерируют высокую вовлеченность...',
    instructions: '1. Укажите платформу (Instagram/Facebook/TikTok)\n2. Опишите тему поста\n3. Укажите целевую аудиторию\n4. Добавьте ключевые слова если нужно',
    isAdded: false,
    isPurchased: false
  },
  {
    id: 'prompt-2',
    title: 'Code Review Assistant',
    description: 'Анализирует код и дает рекомендации по улучшению',
    fullDescription: 'Продвинутый промпт для анализа кода на любом языке программирования. Находит баги, предлагает оптимизации, проверяет соответствие best practices.',
    category: 'coding',
    author: 'DevExpert',
    rating: 4.9,
    reviewsCount: 89,
    price: 299,
    isFree: false,
    createdAt: '2024-01-12T14:20:00Z',
    tags: ['код', 'ревью', 'оптимизация'],
    content: 'Ты опытный senior разработчик. Анализируй предоставленный код и давай детальные рекомендации по улучшению...',
    instructions: '1. Вставьте код для анализа\n2. Укажите язык программирования\n3. Опишите контекст проекта\n4. Укажите приоритеты (производительность/читаемость/безопасность)',
    isAdded: true,
    isPurchased: true
  },
  {
    id: 'prompt-3',
    title: 'Бизнес-план генератор',
    description: 'Создает детальные бизнес-планы для стартапов',
    fullDescription: 'Комплексный промпт для создания профессиональных бизнес-планов. Включает анализ рынка, финансовые прогнозы, стратегию развития.',
    category: 'business',
    author: 'StartupGuru',
    rating: 4.7,
    reviewsCount: 156,
    price: 599,
    isFree: false,
    createdAt: '2024-01-10T09:15:00Z',
    tags: ['бизнес', 'стартап', 'планирование'],
    content: 'Ты опытный бизнес-консультант. Создавай детальные бизнес-планы на основе идеи пользователя...',
    instructions: '1. Опишите бизнес-идею\n2. Укажите целевой рынок\n3. Определите бюджет\n4. Укажите временные рамки',
    isAdded: false,
    isPurchased: false
  },
  {
    id: 'prompt-4',
    title: 'Креативный писатель',
    description: 'Помогает писать рассказы, сценарии, стихи',
    fullDescription: 'Универсальный промпт для творческого письма. Подходит для создания художественных текстов любых жанров.',
    category: 'creative',
    author: 'WriterAI',
    rating: 4.6,
    reviewsCount: 203,
    price: 0,
    isFree: true,
    createdAt: '2024-01-08T16:45:00Z',
    tags: ['творчество', 'писательство', 'сценарии'],
    content: 'Ты талантливый писатель с богатым воображением. Создавай увлекательные истории и помогай развивать творческие идеи...',
    instructions: '1. Выберите жанр\n2. Опишите основную идею\n3. Укажите желаемый объем\n4. Добавьте особые требования',
    isAdded: false,
    isPurchased: false
  }
];

export function LibrarySection() {
  // Состояние данных
  const [prompts, setPrompts] = useState<LibraryPrompt[]>(MOCK_PROMPTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [filteredPrompts, setFilteredPrompts] = useState<LibraryPrompt[]>(MOCK_PROMPTS);
  
  // Состояние UI
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<LibraryPrompt | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Фильтрация промптов
  useEffect(() => {
    let filtered = prompts;
    
    // Фильтр по категории
    if (selectedCategory === 'added') {
      filtered = filtered.filter(prompt => prompt.isAdded);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPrompts(filtered);
  }, [prompts, selectedCategory, searchQuery]);

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Открыть модальное окно промпта
  const handleViewPrompt = (prompt: LibraryPrompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };

  // Добавить бесплатный промпт
  const handleAddPrompt = async (promptId: string) => {
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === promptId 
          ? { ...prompt, isAdded: true }
          : prompt
      )
    );
    
    setLoading(false);
  };

  // Купить платный промпт
  const handleBuyPrompt = (prompt: LibraryPrompt) => {
    setSelectedPrompt(prompt);
    setShowCheckoutModal(true);
  };

  // Имитация успешной покупки
  const handlePurchaseComplete = async () => {
    if (!selectedPrompt) return;
    
    setLoading(true);
    
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === selectedPrompt.id 
          ? { ...prompt, isAdded: true, isPurchased: true }
          : prompt
      )
    );
    
    setShowCheckoutModal(false);
    setShowPromptModal(false);
    setLoading(false);
  };

  // Компонент карточки промпта
  const PromptCard = ({ prompt }: { prompt: LibraryPrompt }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Заголовок и рейтинг */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
          {prompt.title}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500 flex-shrink-0">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{prompt.rating}</span>
          <span>({prompt.reviewsCount})</span>
        </div>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {prompt.description}
      </p>

      {/* Теги */}
      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Автор и дата */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <User className="w-3 h-3 mr-1" />
        <span className="mr-4">{prompt.author}</span>
        <Calendar className="w-3 h-3 mr-1" />
        <span>{formatDate(prompt.createdAt)}</span>
      </div>

      {/* Цена и кнопки */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewPrompt(prompt)}
            className="px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Посмотреть
          </button>
          
          {prompt.isAdded ? (
            <div className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-md">
              <Check className="w-4 h-4 mr-1" />
              Добавлен
            </div>
          ) : prompt.isFree ? (
            <button
              onClick={() => handleAddPrompt(prompt.id)}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Добавить
            </button>
          ) : (
            <button
              onClick={() => handleBuyPrompt(prompt)}
              className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Купить
            </button>
          )}
        </div>
      </div>
      
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Библиотека промптов</h2>
        <p className="text-gray-600">Готовые промпты от сообщества для решения различных задач</p>
      </div>

      {/* Поиск и категории */}
      <div className="space-y-4">
        {/* Поиск */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск промптов..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Категории в виде кнопок */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Список промптов */}
      <div>
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Промпты не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно просмотра промпта */}
      {showPromptModal && selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPrompt.title}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedPrompt.rating} ({selectedPrompt.reviewsCount} отзывов)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedPrompt.author}</span>
                    </div>
                  </div>
                </div>
                {selectedPrompt.isAdded && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое модального окна */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Описание */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                <p className="text-gray-700 leading-relaxed">{selectedPrompt.fullDescription}</p>
              </div>

              {/* Теги */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrompt.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Содержимое промпта */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Содержимое промпта</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                    {selectedPrompt.content}
                  </pre>
                </div>
              </div>

              {/* Инструкции */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Инструкции по использованию</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-blue-900">
                    {selectedPrompt.instructions}
                  </pre>
                </div>
              </div>
            </div>

            {/* Футер модального окна */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                {selectedPrompt.isFree ? (
                  <span className="text-lg font-semibold text-green-600">Бесплатно</span>
                ) : (
                  <div className="flex items-center text-lg font-semibold text-blue-600">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {formatPrice(selectedPrompt.price)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedPrompt.isAdded ? (
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg">
                    <Check className="w-5 h-5 mr-2" />
                    Добавлен в вашу библиотеку
                  </div>
                ) : selectedPrompt.isFree ? (
                  <button
                    onClick={() => handleAddPrompt(selectedPrompt.id)}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      null
                    )}
                    Добавить
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyPrompt(selectedPrompt)}
                    className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Купить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно чекаута */}
      {showCheckoutModal && selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Заголовок в стиле Stripe */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">Оформление покупки</h2>
                  <p className="text-blue-100 text-sm">Безопасная оплата через Stripe</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-white hover:text-blue-100 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Основное содержимое */}
            <div className="flex">
              {/* Левая панель - Форма оплаты */}
              <div className="flex-1 p-8">
                <div className="max-w-md mx-auto">
                  {/* Информация о платеже */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Платежная информация</h3>
                    <p className="text-sm text-gray-600">Все транзакции защищены 256-битным SSL шифрованием</p>
                  </div>

                  {/* Форма карты в стиле Stripe */}
                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email адрес
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Номер карты */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Номер карты
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                          <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Срок действия и CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Срок действия
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Имя на карте */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя на карте
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Страна */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Страна
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <option>Россия</option>
                        <option>США</option>
                        <option>Германия</option>
                        <option>Франция</option>
                      </select>
                    </div>
                  </div>

                  {/* Кнопка оплаты */}
                  <button
                    onClick={handlePurchaseComplete}
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Обработка платежа...
                      </div>
                    ) : (
                      `Оплатить ${formatPrice(selectedPrompt.price)}`
                    )}
                  </button>

                  {/* Безопасность */}
                  <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span>Защищено SSL шифрованием</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая панель - Сводка заказа */}
              <div className="w-80 bg-gray-50 p-8 border-l border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Сводка заказа</h3>
                
                {/* Информация о промпте */}
                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedPrompt.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{selectedPrompt.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{selectedPrompt.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{selectedPrompt.author}</span>
                    </div>
                  </div>
                </div>

                {/* Детали оплаты */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Стоимость промпта</span>
                    <span className="font-medium">{formatPrice(selectedPrompt.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Комиссия платформы</span>
                    <span className="font-medium">₽0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Итого</span>
                      <span className="font-bold text-xl text-blue-600">{formatPrice(selectedPrompt.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Гарантии */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Наши гарантии</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Возврат средств в течение 7 дней</li>
                    <li>• Техническая поддержка 24/7</li>
                    <li>• Безопасные платежи</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}