import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Plus, ShoppingCart, Check, X, Star, User, Calendar, DollarSign } from 'lucide-react';

// Типы данных для аватаров
interface LibraryAvatar {
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
  avatarImage: string; // URL изображения аватара
  specialization: string; // специализация аватара
  personality: string; // описание личности
  isInstalled: boolean; // установлен ли аватар
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
  { id: 'installed', name: 'Установлено', count: 3 },
  { id: 'business', name: 'Бизнес', count: 8 },
  { id: 'creative', name: 'Креативность', count: 6 },
  { id: 'education', name: 'Образование', count: 4 },
  { id: 'health', name: 'Здоровье', count: 3 },
  { id: 'tech', name: 'Технологии', count: 5 },
];

// Mock данные аватаров
const MOCK_AVATARS: LibraryAvatar[] = [
  {
    id: 'avatar-1',
    title: 'Бизнес-консультант Анна',
    description: 'Эксперт по стратегическому планированию и развитию бизнеса',
    fullDescription: 'Профессиональный бизнес-консультант с 15-летним опытом. Специализируется на стратегическом планировании, анализе рынка и развитии стартапов.',
    category: 'business',
    author: 'BusinessPro',
    rating: 4.8,
    reviewsCount: 127,
    price: 0,
    isFree: true,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['бизнес', 'стратегия', 'консалтинг'],
    avatarImage: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Стратегическое планирование',
    personality: 'Аналитичная, целеустремленная, профессиональная. Всегда готова помочь с бизнес-решениями.',
    isInstalled: false,
    isPurchased: false
  },
  {
    id: 'avatar-2',
    title: 'Креативный директор Макс',
    description: 'Дизайнер и креативщик для творческих проектов',
    fullDescription: 'Опытный креативный директор с портфолио международных брендов. Поможет с дизайном, брендингом и творческими решениями.',
    category: 'creative',
    author: 'DesignMaster',
    rating: 4.9,
    reviewsCount: 89,
    price: 299,
    isFree: false,
    createdAt: '2024-01-12T14:20:00Z',
    tags: ['дизайн', 'креатив', 'брендинг'],
    avatarImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Креативное направление',
    personality: 'Вдохновляющий, творческий, инновационный. Видит красоту в деталях.',
    isInstalled: true,
    isPurchased: true
  },
  {
    id: 'avatar-3',
    title: 'Преподаватель Елена',
    description: 'Опытный педагог и методист для обучения',
    fullDescription: 'Кандидат педагогических наук с 20-летним стажем. Специализируется на современных методиках обучения и развитии навыков.',
    category: 'education',
    author: 'EduExpert',
    rating: 4.7,
    reviewsCount: 156,
    price: 199,
    isFree: false,
    createdAt: '2024-01-10T09:15:00Z',
    tags: ['образование', 'методика', 'развитие'],
    avatarImage: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Образовательные методики',
    personality: 'Терпеливая, мудрая, поддерживающая. Умеет объяснить сложное простыми словами.',
    isInstalled: false,
    isPurchased: false
  },
  {
    id: 'avatar-4',
    title: 'Фитнес-тренер Алексей',
    description: 'Персональный тренер и специалист по здоровому образу жизни',
    fullDescription: 'Сертифицированный фитнес-тренер и нутрициолог. Поможет составить программу тренировок и план питания.',
    category: 'health',
    author: 'FitnessPro',
    rating: 4.6,
    reviewsCount: 203,
    price: 0,
    isFree: true,
    createdAt: '2024-01-08T16:45:00Z',
    tags: ['фитнес', 'здоровье', 'тренировки'],
    avatarImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Персональные тренировки',
    personality: 'Мотивирующий, энергичный, заботливый. Поможет достичь ваших целей в фитнесе.',
    isInstalled: true,
    isPurchased: false
  },
  {
    id: 'avatar-5',
    title: 'IT-архитектор Дмитрий',
    description: 'Senior разработчик и архитектор решений',
    fullDescription: 'Ведущий архитектор с опытом в enterprise решениях. Эксперт по микросервисам, облачным технологиям и DevOps.',
    category: 'tech',
    author: 'TechGuru',
    rating: 4.9,
    reviewsCount: 95,
    price: 499,
    isFree: false,
    createdAt: '2024-01-06T11:30:00Z',
    tags: ['программирование', 'архитектура', 'devops'],
    avatarImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Архитектура ПО',
    personality: 'Логичный, системный, надежный. Решает сложные технические задачи.',
    isInstalled: false,
    isPurchased: false
  },
  {
    id: 'avatar-6',
    title: 'Психолог София',
    description: 'Клинический психолог и коуч по личностному росту',
    fullDescription: 'Практикующий психолог с опытом работы в когнитивно-поведенческой терапии. Специализируется на работе со стрессом и личностным развитием.',
    category: 'health',
    author: 'MindHelper',
    rating: 4.8,
    reviewsCount: 178,
    price: 399,
    isFree: false,
    createdAt: '2024-01-04T13:20:00Z',
    tags: ['психология', 'коучинг', 'развитие'],
    avatarImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
    specialization: 'Психологическая поддержка',
    personality: 'Эмпатичная, понимающая, мудрая. Поможет разобраться в себе и найти решения.',
    isInstalled: true,
    isPurchased: true
  }
];

export function LibrarySection() {
  // Состояние данных
  const [avatars, setAvatars] = useState<LibraryAvatar[]>(MOCK_AVATARS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [filteredAvatars, setFilteredAvatars] = useState<LibraryAvatar[]>(MOCK_AVATARS);
  
  // Состояние UI
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<LibraryAvatar | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Фильтрация аватаров
  useEffect(() => {
    let filtered = avatars;
    
    // Фильтр по категории
    if (selectedCategory === 'installed') {
      filtered = filtered.filter(avatar => avatar.isInstalled);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(avatar => avatar.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(avatar => 
        avatar.title.toLowerCase().includes(query) ||
        avatar.description.toLowerCase().includes(query) ||
        avatar.specialization.toLowerCase().includes(query) ||
        avatar.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredAvatars(filtered);
  }, [avatars, selectedCategory, searchQuery]);

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

  // Открыть модальное окно аватара
  const handleViewAvatar = (avatar: LibraryAvatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarModal(true);
  };

  // Установить бесплатный аватар
  const handleInstallAvatar = async (avatarId: string) => {
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAvatars(prevAvatars => 
      prevAvatars.map(avatar => 
        avatar.id === avatarId 
          ? { ...avatar, isInstalled: true }
          : avatar
      )
    );
    
    setLoading(false);
  };

  // Купить платный аватар
  const handleBuyAvatar = (avatar: LibraryAvatar) => {
    setSelectedAvatar(avatar);
    setShowCheckoutModal(true);
  };

  // Имитация успешной покупки
  const handlePurchaseComplete = async () => {
    if (!selectedAvatar) return;
    
    setLoading(true);
    
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAvatars(prevAvatars => 
      prevAvatars.map(avatar => 
        avatar.id === selectedAvatar.id 
          ? { ...avatar, isInstalled: true, isPurchased: true }
          : avatar
      )
    );
    
    setShowCheckoutModal(false);
    setShowAvatarModal(false);
    setLoading(false);
  };

  // Компонент карточки аватара
  const AvatarCard = ({ avatar }: { avatar: LibraryAvatar }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Изображение аватара */}
      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img 
          src={avatar.avatarImage} 
          alt={avatar.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Заголовок и рейтинг */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
          {avatar.title}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500 flex-shrink-0">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{avatar.rating}</span>
          <span>({avatar.reviewsCount})</span>
        </div>
      </div>

      {/* Специализация */}
      <div className="mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {avatar.specialization}
        </span>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {avatar.description}
      </p>

      {/* Теги */}
      <div className="flex flex-wrap gap-2 mb-4">
        {avatar.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Автор и дата */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <User className="w-3 h-3 mr-1" />
        <span className="mr-4">{avatar.author}</span>
        <Calendar className="w-3 h-3 mr-1" />
        <span>{formatDate(avatar.createdAt)}</span>
      </div>

      {/* Цена и кнопки */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewAvatar(avatar)}
            className="px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Посмотреть
          </button>
          
          {avatar.isInstalled ? (
            <div className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-md">
              <Check className="w-4 h-4 mr-1" />
              Установлен
            </div>
          ) : avatar.isFree ? (
            <button
              onClick={() => handleInstallAvatar(avatar.id)}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Установить
            </button>
          ) : (
            <button
              onClick={() => handleBuyAvatar(avatar)}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Библиотека аватаров</h2>
        <p className="text-gray-600">Маркетплейс аватаров и специализаций от сообщества</p>
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
            placeholder="Поиск аватаров..."
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

      {/* Список аватаров */}
      <div>
        {filteredAvatars.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Аватары не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAvatars.map(avatar => (
              <AvatarCard key={avatar.id} avatar={avatar} />
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно просмотра аватара */}
      {showAvatarModal && selectedAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedAvatar.avatarImage} 
                  alt={selectedAvatar.title}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedAvatar.title}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedAvatar.rating} ({selectedAvatar.reviewsCount} отзывов)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedAvatar.author}</span>
                    </div>
                  </div>
                </div>
                {selectedAvatar.isInstalled && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое модального окна */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Левая колонка - Изображение и основная информация */}
                <div className="space-y-6">
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={selectedAvatar.avatarImage} 
                      alt={selectedAvatar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Специализация</h3>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {selectedAvatar.specialization}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Теги</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAvatar.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Правая колонка - Описание и личность */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedAvatar.fullDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Личность</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        {selectedAvatar.personality}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>Автор: {selectedAvatar.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Создан: {formatDate(selectedAvatar.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        <span>Рейтинг: {selectedAvatar.rating} ({selectedAvatar.reviewsCount} отзывов)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Футер модального окна */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                {selectedAvatar.isFree ? (
                  <span className="text-lg font-semibold text-green-600">Бесплатно</span>
                ) : (
                  <div className="flex items-center text-lg font-semibold text-blue-600">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {formatPrice(selectedAvatar.price)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedAvatar.isInstalled ? (
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg">
                    <Check className="w-5 h-5 mr-2" />
                    Установлен в вашей библиотеке
                  </div>
                ) : selectedAvatar.isFree ? (
                  <button
                    onClick={() => handleInstallAvatar(selectedAvatar.id)}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      null
                    )}
                    Установить
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuyAvatar(selectedAvatar)}
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
      {showCheckoutModal && selectedAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Заголовок в стиле Stripe */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">Покупка аватара</h2>
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
                      `Оплатить ${formatPrice(selectedAvatar.price)}`
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
                
                {/* Информация об аватаре */}
                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={selectedAvatar.avatarImage} 
                      alt={selectedAvatar.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedAvatar.title}</h4>
                      <p className="text-sm text-gray-600">{selectedAvatar.specialization}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{selectedAvatar.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{selectedAvatar.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{selectedAvatar.author}</span>
                    </div>
                  </div>
                </div>

                {/* Детали оплаты */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Стоимость аватара</span>
                    <span className="font-medium">{formatPrice(selectedAvatar.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Комиссия платформы</span>
                    <span className="font-medium">₽0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Итого</span>
                      <span className="font-bold text-xl text-blue-600">{formatPrice(selectedAvatar.price)}</span>
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
                    <li>• Пожизненные обновления</li>
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