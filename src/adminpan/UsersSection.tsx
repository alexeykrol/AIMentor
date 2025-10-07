import React, { useState, useEffect } from 'react';
import { User, Mail, MessageCircle, Clock, TrendingUp, Copy, Save, Share, Star, CreditCard, DollarSign, Eye, X } from 'lucide-react';

// Типы данных
interface UserAnalytics {
  id: string;
  email: string;
  chatsCount: number;
  avgQuestionsPerChat: number;
  avgQuestionLength: number;
  loginFrequency: string; // "Ежедневно", "Еженедельно", "Редко"
  copyCount: number;
  saveCount: number;
  shareCount: number;
  totalTimeInSystem: number; // в минутах
  engagementLevel: 'Низкий' | 'Средний' | 'Высокий';
  subscription: 'Free' | 'Pro' | 'Premium';
  mrr: number; // Monthly Recurring Revenue в рублях
  registeredAt: string;
  lastLoginAt: string;
  totalQuestions: number;
  favoriteTopics: string[];
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  location: string;
}

// Mock данные пользователей
const MOCK_USERS: UserAnalytics[] = [
  {
    id: 'user-1',
    email: 'alex.petrov@gmail.com',
    chatsCount: 45,
    avgQuestionsPerChat: 8.2,
    avgQuestionLength: 127,
    loginFrequency: 'Ежедневно',
    copyCount: 156,
    saveCount: 23,
    shareCount: 7,
    totalTimeInSystem: 2340, // 39 часов
    engagementLevel: 'Высокий',
    subscription: 'Premium',
    mrr: 1999,
    registeredAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-01-20T14:25:00Z',
    totalQuestions: 369,
    favoriteTopics: ['Программирование', 'ИИ', 'Стартапы'],
    deviceType: 'Desktop',
    location: 'Москва, Россия'
  },
  {
    id: 'user-2',
    email: 'maria.ivanova@yandex.ru',
    chatsCount: 28,
    avgQuestionsPerChat: 5.7,
    avgQuestionLength: 89,
    loginFrequency: 'Еженедельно',
    copyCount: 67,
    saveCount: 12,
    shareCount: 3,
    totalTimeInSystem: 1560, // 26 часов
    engagementLevel: 'Средний',
    subscription: 'Pro',
    mrr: 999,
    registeredAt: '2024-01-12T09:15:00Z',
    lastLoginAt: '2024-01-19T16:40:00Z',
    totalQuestions: 160,
    favoriteTopics: ['Маркетинг', 'Дизайн', 'Психология'],
    deviceType: 'Mobile',
    location: 'Санкт-Петербург, Россия'
  },
  {
    id: 'user-3',
    email: 'dmitry.kozlov@mail.ru',
    chatsCount: 12,
    avgQuestionsPerChat: 3.4,
    avgQuestionLength: 156,
    loginFrequency: 'Редко',
    copyCount: 23,
    saveCount: 4,
    shareCount: 1,
    totalTimeInSystem: 480, // 8 часов
    engagementLevel: 'Низкий',
    subscription: 'Free',
    mrr: 0,
    registeredAt: '2024-01-10T14:20:00Z',
    lastLoginAt: '2024-01-18T11:15:00Z',
    totalQuestions: 41,
    favoriteTopics: ['Образование', 'Наука'],
    deviceType: 'Tablet',
    location: 'Екатеринбург, Россия'
  },
  {
    id: 'user-4',
    email: 'elena.smirnova@outlook.com',
    chatsCount: 67,
    avgQuestionsPerChat: 12.1,
    avgQuestionLength: 203,
    loginFrequency: 'Ежедневно',
    copyCount: 289,
    saveCount: 45,
    shareCount: 18,
    totalTimeInSystem: 4200, // 70 часов
    engagementLevel: 'Высокий',
    subscription: 'Premium',
    mrr: 1999,
    registeredAt: '2024-01-08T16:45:00Z',
    lastLoginAt: '2024-01-20T18:30:00Z',
    totalQuestions: 811,
    favoriteTopics: ['Бизнес', 'Финансы', 'Инвестиции', 'Менеджмент'],
    deviceType: 'Desktop',
    location: 'Новосибирск, Россия'
  },
  {
    id: 'user-5',
    email: 'sergey.volkov@gmail.com',
    chatsCount: 19,
    avgQuestionsPerChat: 6.8,
    avgQuestionLength: 98,
    loginFrequency: 'Еженедельно',
    copyCount: 45,
    saveCount: 8,
    shareCount: 2,
    totalTimeInSystem: 920, // 15.3 часа
    engagementLevel: 'Средний',
    subscription: 'Free',
    mrr: 0,
    registeredAt: '2024-01-14T11:30:00Z',
    lastLoginAt: '2024-01-19T13:20:00Z',
    totalQuestions: 129,
    favoriteTopics: ['Технологии', 'Игры'],
    deviceType: 'Mobile',
    location: 'Казань, Россия'
  },
  {
    id: 'user-6',
    email: 'anna.fedorova@rambler.ru',
    chatsCount: 34,
    avgQuestionsPerChat: 9.3,
    avgQuestionLength: 174,
    loginFrequency: 'Ежедневно',
    copyCount: 112,
    saveCount: 19,
    shareCount: 9,
    totalTimeInSystem: 2880, // 48 часов
    engagementLevel: 'Высокий',
    subscription: 'Pro',
    mrr: 999,
    registeredAt: '2024-01-11T13:20:00Z',
    lastLoginAt: '2024-01-20T15:45:00Z',
    totalQuestions: 316,
    favoriteTopics: ['Творчество', 'Искусство', 'Литература'],
    deviceType: 'Desktop',
    location: 'Нижний Новгород, Россия'
  }
];

export function UsersSection() {
  // Состояние данных
  const [users, setUsers] = useState<UserAnalytics[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<UserAnalytics | null>(null);
  
  // Состояние UI
  const [loading, setLoading] = useState(false);

  // Форматирование времени в системе
  const formatTimeInSystem = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}м`;
    if (mins === 0) return `${hours}ч`;
    return `${hours}ч ${mins}м`;
  };

  // Форматирование MRR
  const formatMRR = (amount: number) => {
    if (amount === 0) return '₽0';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получить цвет для уровня вовлеченности
  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'Высокий': return 'bg-green-100 text-green-800';
      case 'Средний': return 'bg-yellow-100 text-yellow-800';
      case 'Низкий': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Получить цвет для подписки
  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Получить цвет для частоты заходов
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Ежедневно': return 'bg-green-100 text-green-800';
      case 'Еженедельно': return 'bg-yellow-100 text-yellow-800';
      case 'Редко': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Открыть профиль пользователя
  const handleUserSelect = (user: UserAnalytics) => {
    setSelectedUserForDetails(user);
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Выбрать пользователя для панели деталей (без открытия модального окна)
  const handleUserSelectForDetails = (user: UserAnalytics) => {
    setSelectedUserForDetails(user);
  };

  // Закрыть профиль
  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Управление пользователями</h2>
        <p className="text-gray-600">Аналитика активности и поведения пользователей системы</p>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Email
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                  Чаты
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Ср. вопросов/чат
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Ср. длина вопросов
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Частота заходов
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Копирования
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Сохранения
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Шеринги
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Время в системе
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Вовлеченность
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Подписка
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  MRR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserSelectForDetails(user)}
                  onDoubleClick={() => handleUserSelect(user)}
                  className={`cursor-pointer transition-colors ${
                    selectedUserForDetails?.id === user.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-25 hover:bg-gray-75'
                  }`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.chatsCount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.avgQuestionsPerChat.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.avgQuestionLength} симв.
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(user.loginFrequency)}`}>
                      {user.loginFrequency}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.copyCount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.saveCount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.shareCount}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatTimeInSystem(user.totalTimeInSystem)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(user.engagementLevel)}`}>
                      {user.engagementLevel}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatMRR(user.mrr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Панель деталей пользователя */}
      {selectedUserForDetails && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUserForDetails.email}</h3>
                <p className="text-sm text-gray-500">Детали пользователя</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleUserSelect(selectedUserForDetails)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Полный профиль
              </button>
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Левая колонка - Основная информация */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Устройство</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.deviceType}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400 flex items-center justify-center">🌍</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Местоположение</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Регистрация</div>
                        <div className="text-sm text-gray-600">{formatDate(selectedUserForDetails.registeredAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Последний вход</div>
                        <div className="text-sm text-gray-600">{formatDate(selectedUserForDetails.lastLoginAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Подписка</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Тип подписки</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(selectedUserForDetails.subscription)}`}>
                          {selectedUserForDetails.subscription}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">MRR</div>
                        <div className="text-sm text-gray-600 font-semibold">{formatMRR(selectedUserForDetails.mrr)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Средняя колонка - Активность */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Активность в чатах</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Всего чатов</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.chatsCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Всего вопросов</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.totalQuestions}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Среднее вопросов на чат</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.avgQuestionsPerChat.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400 flex items-center justify-center">📝</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Средняя длина вопросов</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.avgQuestionLength} символов</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Интересы</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserForDetails.favoriteTopics.map(topic => (
                      <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Правая колонка - Поведение */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Поведение</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400 flex items-center justify-center">🔄</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Частота заходов</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(selectedUserForDetails.loginFrequency)}`}>
                          {selectedUserForDetails.loginFrequency}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Copy className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Копирования</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.copyCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Save className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Сохранения</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.saveCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Share className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Шеринги</div>
                        <div className="text-sm text-gray-600">{selectedUserForDetails.shareCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Время в системе</div>
                        <div className="text-sm text-gray-600">{formatTimeInSystem(selectedUserForDetails.totalTimeInSystem)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Уровень вовлеченности</div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(selectedUserForDetails.engagementLevel)}`}>
                          {selectedUserForDetails.engagementLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно профиля пользователя */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedUser.email}</h2>
                  <p className="text-sm text-gray-500">Профиль пользователя</p>
                </div>
              </div>
              <button
                onClick={handleCloseProfile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое профиля */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Левая колонка - Основная информация */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Email</div>
                          <div className="text-sm text-gray-600">{selectedUser.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Устройство</div>
                          <div className="text-sm text-gray-600">{selectedUser.deviceType}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 text-gray-400 flex items-center justify-center">🌍</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Местоположение</div>
                          <div className="text-sm text-gray-600">{selectedUser.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Регистрация</div>
                          <div className="text-sm text-gray-600">{formatDate(selectedUser.registeredAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Последний вход</div>
                          <div className="text-sm text-gray-600">{formatDate(selectedUser.lastLoginAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Подписка и платежи</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Тип подписки</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(selectedUser.subscription)}`}>
                            {selectedUser.subscription}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">MRR (месячный доход)</div>
                          <div className="text-sm text-gray-600 font-semibold">{formatMRR(selectedUser.mrr)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Интересы</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.favoriteTopics.map(topic => (
                        <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Правая колонка - Аналитика активности */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность в чатах</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Всего чатов</div>
                          <div className="text-sm text-gray-600">{selectedUser.chatsCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Всего вопросов</div>
                          <div className="text-sm text-gray-600">{selectedUser.totalQuestions}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Среднее вопросов на чат</div>
                          <div className="text-sm text-gray-600">{selectedUser.avgQuestionsPerChat.toFixed(1)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 text-gray-400 flex items-center justify-center">📝</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Средняя длина вопросов</div>
                          <div className="text-sm text-gray-600">{selectedUser.avgQuestionLength} символов</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Поведение и вовлеченность</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 text-gray-400 flex items-center justify-center">🔄</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Частота заходов</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(selectedUser.loginFrequency)}`}>
                            {selectedUser.loginFrequency}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Copy className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Копирования</div>
                          <div className="text-sm text-gray-600">{selectedUser.copyCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Save className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Сохранения</div>
                          <div className="text-sm text-gray-600">{selectedUser.saveCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Share className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Шеринги</div>
                          <div className="text-sm text-gray-600">{selectedUser.shareCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Время в системе</div>
                          <div className="text-sm text-gray-600">{formatTimeInSystem(selectedUser.totalTimeInSystem)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Уровень вовлеченности</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(selectedUser.engagementLevel)}`}>
                            {selectedUser.engagementLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}