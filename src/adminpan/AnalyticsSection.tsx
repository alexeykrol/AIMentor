import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, UserCheck, Percent, Calendar, DollarSign, MessageSquare, ArrowUp, ArrowDown, X } from 'lucide-react';

// Типы данных
interface ContactsData {
  period: string;
  uniqueVisitors: number;
  users: number;
  conversion: number; // в процентах
  churn: number; // количество пользователей, не возвращавшихся более месяца
  churnRate: number; // отношение ушедших к новым пользователям в процентах
}

interface TokenData {
  id: string;
  promptName: string;
  inputTokens: number;
  outputTokens: number;
  inputPrice: number; // в рублях
  outputPrice: number; // в рублях
  promptContent: string;
  promptType: 'user' | 'assistant' | 'developer';
  promptNotes: string;
  createdAt: string;
}

type TokenPeriod = 'day' | 'week' | 'month';

// Mock данные контактов (последние 7 дней)
const MOCK_CONTACTS_SUMMARY = [
  {
    period: 'За последний день',
    uniqueVisitors: 1247,
    users: 89,
    conversion: 7.14,
    churn: 23,
    churnRate: 25.84
  },
  {
    period: 'За последнюю неделю',
    uniqueVisitors: 8514,
    users: 583,
    conversion: 6.85,
    churn: 156,
    churnRate: 26.76
  },
  {
    period: 'За последний месяц',
    uniqueVisitors: 34280,
    users: 2341,
    conversion: 6.83,
    churn: 487,
    churnRate: 20.80
  }
];

// Mock данные для графиков конверсии за месяц (30 дней)
const MOCK_CONVERSION_CHART = [
  { day: 1, conversion: 6.2 },
  { day: 2, conversion: 6.8 },
  { day: 3, conversion: 7.1 },
  { day: 4, conversion: 6.9 },
  { day: 5, conversion: 7.3 },
  { day: 6, conversion: 6.7 },
  { day: 7, conversion: 7.0 },
  { day: 8, conversion: 6.5 },
  { day: 9, conversion: 7.2 },
  { day: 10, conversion: 6.8 },
  { day: 11, conversion: 7.4 },
  { day: 12, conversion: 6.9 },
  { day: 13, conversion: 7.1 },
  { day: 14, conversion: 6.6 },
  { day: 15, conversion: 7.0 },
  { day: 16, conversion: 6.8 },
  { day: 17, conversion: 7.2 },
  { day: 18, conversion: 6.7 },
  { day: 19, conversion: 6.9 },
  { day: 20, conversion: 7.1 },
  { day: 21, conversion: 6.8 },
  { day: 22, conversion: 7.3 },
  { day: 23, conversion: 6.9 },
  { day: 24, conversion: 7.0 },
  { day: 25, conversion: 6.7 },
  { day: 26, conversion: 7.2 },
  { day: 27, conversion: 6.8 },
  { day: 28, conversion: 7.1 },
  { day: 29, conversion: 6.9 },
  { day: 30, conversion: 7.14 }
];

// Mock данные для графика оттока за месяц (30 дней)
const MOCK_CHURN_CHART = [
  { day: 1, churn: 12 },
  { day: 2, churn: 15 },
  { day: 3, churn: 18 },
  { day: 4, churn: 14 },
  { day: 5, churn: 16 },
  { day: 6, churn: 13 },
  { day: 7, churn: 19 },
  { day: 8, churn: 17 },
  { day: 9, churn: 21 },
  { day: 10, churn: 16 },
  { day: 11, churn: 14 },
  { day: 12, churn: 18 },
  { day: 13, churn: 20 },
  { day: 14, churn: 15 },
  { day: 15, churn: 17 },
  { day: 16, churn: 19 },
  { day: 17, churn: 16 },
  { day: 18, churn: 22 },
  { day: 19, churn: 18 },
  { day: 20, churn: 20 },
  { day: 21, churn: 17 },
  { day: 22, churn: 15 },
  { day: 23, churn: 19 },
  { day: 24, churn: 21 },
  { day: 25, churn: 18 },
  { day: 26, churn: 16 },
  { day: 27, churn: 20 },
  { day: 28, churn: 19 },
  { day: 29, churn: 17 },
  { day: 30, churn: 23 }
];

// Mock данные токенов
const MOCK_TOKENS: TokenData[] = [
  {
    id: 'token-1',
    promptName: 'Системный промпт для чата',
    inputTokens: 15420,
    outputTokens: 28750,
    inputPrice: 92.52,
    outputPrice: 172.50,
    promptContent: 'Ты полезный AI ассистент. Отвечай кратко и по делу. Будь дружелюбным и профессиональным.',
    promptType: 'assistant',
    promptNotes: 'Базовая версия системного промпта для общего чата',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'token-2',
    promptName: 'Промпт для анализа пользователя',
    inputTokens: 8930,
    outputTokens: 12450,
    inputPrice: 53.58,
    outputPrice: 74.70,
    promptContent: 'Анализируй интересы пользователя на основе его вопросов. Выдели ключевые темы.',
    promptType: 'developer',
    promptNotes: 'Промпт для персонального анализа в режиме "Мой вопрос"',
    createdAt: '2024-01-12T09:15:00Z'
  },
  {
    id: 'token-3',
    promptName: 'Копирайтер для соцсетей',
    inputTokens: 12340,
    outputTokens: 18920,
    inputPrice: 74.04,
    outputPrice: 113.52,
    promptContent: 'Создавай вирусные посты для Instagram, Facebook, TikTok. Учитывай особенности каждой платформы.',
    promptType: 'user',
    promptNotes: 'Промпт для создания контента в социальных сетях',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'token-4',
    promptName: 'Code Review Assistant',
    inputTokens: 6780,
    outputTokens: 9450,
    inputPrice: 40.68,
    outputPrice: 56.70,
    promptContent: 'Анализируй код и давай рекомендации по улучшению. Проверяй на баги и оптимизации.',
    promptType: 'developer',
    promptNotes: 'Промпт для анализа и ревью кода',
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: 'token-5',
    promptName: 'Бизнес-план генератор',
    inputTokens: 4560,
    outputTokens: 7890,
    inputPrice: 27.36,
    outputPrice: 47.34,
    promptContent: 'Создавай детальные бизнес-планы на основе идеи пользователя. Включай анализ рынка и финансы.',
    promptType: 'user',
    promptNotes: 'Промпт для создания бизнес-планов',
    createdAt: '2024-01-06T11:30:00Z'
  }
];

const PROMPT_TYPES = [
  { value: 'user', label: 'Пользовательский', color: 'bg-green-100 text-green-800' },
  { value: 'assistant', label: 'Ассистент', color: 'bg-blue-100 text-blue-800' },
  { value: 'developer', label: 'Девелопер', color: 'bg-purple-100 text-purple-800' }
];

export function AnalyticsSection() {
  // Состояние данных
  const [contactsData, setContactsData] = useState<ContactsData[]>(MOCK_CONTACTS_SUMMARY);
  const [tokensData, setTokensData] = useState<TokenData[]>(MOCK_TOKENS);
  const [selectedPeriod, setSelectedPeriod] = useState<TokenPeriod>('day');
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  
  // Состояние UI
  const [loading, setLoading] = useState(false);

  // Форматирование числа с разделителями
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Форматирование даты промпта
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получить информацию о типе промпта
  const getPromptTypeInfo = (type: string) => {
    return PROMPT_TYPES.find(t => t.value === type) || PROMPT_TYPES[1];
  };

  // Обработка смены периода для токенов
  const handlePeriodChange = (period: TokenPeriod) => {
    setSelectedPeriod(period);
    // Здесь можно добавить логику фильтрации данных по периоду
  };

  // Обработка клика по промпту
  const handlePromptClick = (token: TokenData) => {
    setSelectedToken(token);
    setShowPromptDetails(true);
  };

  // Закрытие деталей промпта
  const handleClosePromptDetails = () => {
    setShowPromptDetails(false);
    setSelectedToken(null);
  };

  // Простой компонент графика (заглушка)
  const SimpleChart = ({ data, type, title }: { data: any[], type: 'conversion' | 'churn', title: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {type === 'conversion' ? '6.83%' : '487'}
          </div>
          <div className="text-sm text-gray-500">
            {type === 'conversion' ? 'Средняя конверсия' : 'Общий отток'}
          </div>
          <div className="mt-4 text-xs text-gray-400">
            График будет здесь при интеграции с Chart.js
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Аналитика системы</h2>
        <p className="text-gray-600">Статистика посещений, конверсии и использования токенов</p>
      </div>

      {/* 1. Таблица Конверсия */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Конверсия
          </h3>
          <p className="text-sm text-gray-500 mt-1">Статистика конверсии и оттока пользователей</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Период
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Уникальных посетителей
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователей
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Конверсия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отток
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Черн
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactsData.map((contact, index) => {                
                return (
                  <tr key={contact.period} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {contact.period}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(contact.uniqueVisitors)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(contact.users)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.conversion.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatNumber(contact.churn)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-orange-600">
                        {contact.churnRate.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          data={MOCK_CONVERSION_CHART} 
          type="conversion" 
          title="Конверсия за последний месяц" 
        />
        <SimpleChart 
          data={MOCK_CHURN_CHART} 
          type="churn" 
          title="Отток за последний месяц" 
        />
      </div>

      {/* 3. Таблица Токены */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Использование токенов
              </h3>
              <p className="text-sm text-gray-500 mt-1">Статистика потребления токенов по промптам</p>
            </div>
            
            {/* Кнопки периодов */}
            <div className="flex space-x-1">
              {[
                { key: 'day' as TokenPeriod, label: 'За день' },
                { key: 'week' as TokenPeriod, label: 'За неделю' },
                { key: 'month' as TokenPeriod, label: 'За месяц' }
              ].map(period => (
                <button
                  key={period.key}
                  onClick={() => handlePeriodChange(period.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedPeriod === period.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Промпт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Входящих токенов
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Исходящих токенов
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена входящих
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена исходящих
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokensData.map((token) => {
                const typeInfo = getPromptTypeInfo(token.promptType);
                return (
                  <tr
                    key={token.id}
                    onClick={() => handlePromptClick(token)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {token.promptName}
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color} mt-1`}>
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(token.inputTokens)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(token.outputTokens)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatPrice(token.inputPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatPrice(token.outputPrice)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Панель деталей промпта */}
      {showPromptDetails && selectedToken && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedToken.promptName}</h3>
                <p className="text-sm text-gray-500">Детали промпта</p>
              </div>
            </div>
            <button
              onClick={handleClosePromptDetails}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Левая колонка - Основная информация */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Информация о промпте</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Название</div>
                      <div className="text-sm text-gray-900">{selectedToken.promptName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Тип</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPromptTypeInfo(selectedToken.promptType).color}`}>
                        {getPromptTypeInfo(selectedToken.promptType).label}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Дата создания</div>
                      <div className="text-sm text-gray-900">{formatDate(selectedToken.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Статистика токенов</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-blue-700">Входящие токены</div>
                      <div className="text-2xl font-bold text-blue-900">{formatNumber(selectedToken.inputTokens)}</div>
                      <div className="text-sm text-blue-600">{formatPrice(selectedToken.inputPrice)}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-green-700">Исходящие токены</div>
                      <div className="text-2xl font-bold text-green-900">{formatNumber(selectedToken.outputTokens)}</div>
                      <div className="text-sm text-green-600">{formatPrice(selectedToken.outputPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая колонка - Содержимое */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Содержимое промпта</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                      {selectedToken.promptContent}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Примечания</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      {selectedToken.promptNotes}
                    </p>
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