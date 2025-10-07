import React, { useState, useEffect } from 'react';
import { Download, Calendar, CreditCard, ChevronDown, ChevronUp, X, MessageCircle, Bot, Zap, Clock, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

// Типы данных
interface PaymentRecord {
  id: string;
  date: string;
  plan: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
  paymentMethod: string;
  // Детализация использования
  details: {
    chatsCount: number;
    messagesCount: number;
    tokensUsed: number;
    mentorsUsed: string[];
    timeInSystem: number; // в минутах
    featuresUsed: string[];
    averageSessionTime: number; // в минутах
    peakUsageDay: string;
  };
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal' | 'apple_pay';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  addedAt: string;
}

// Mock данные способов оплаты
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'visa',
    last4: '1234',
    expiryMonth: '12',
    expiryYear: '2026',
    holderName: 'Alexey Petrov',
    isDefault: true,
    addedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'pm-2',
    type: 'mastercard',
    last4: '5678',
    expiryMonth: '08',
    expiryYear: '2025',
    holderName: 'Alexey Petrov',
    isDefault: false,
    addedAt: '2023-11-20T14:20:00Z'
  }
];

// Mock данные платежей
const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'payment-1',
    date: '2024-01-15T10:30:00Z',
    plan: 'Уровень 1',
    amount: 5.00,
    currency: '$',
    status: 'paid',
    invoiceNumber: 'INV-2024-001',
    paymentMethod: 'Visa ****1234',
    details: {
      chatsCount: 45,
      messagesCount: 369,
      tokensUsed: 15420,
      mentorsUsed: ['Бизнес-консультант Анна', 'Креативный директор Макс'],
      timeInSystem: 2340, // 39 часов
      featuresUsed: ['Персональный анализ', 'Экспорт чатов', 'Email поддержка'],
      averageSessionTime: 52, // 52 минуты
      peakUsageDay: '2024-01-10'
    }
  },
  {
    id: 'payment-2',
    date: '2023-12-15T14:20:00Z',
    plan: 'Уровень 1',
    amount: 5.00,
    currency: '$',
    status: 'paid',
    invoiceNumber: 'INV-2023-012',
    paymentMethod: 'Visa ****1234',
    details: {
      chatsCount: 38,
      messagesCount: 287,
      tokensUsed: 12890,
      mentorsUsed: ['Преподаватель Елена'],
      timeInSystem: 1980, // 33 часа
      featuresUsed: ['Персональный анализ', 'Email поддержка'],
      averageSessionTime: 48,
      peakUsageDay: '2023-12-08'
    }
  },
  {
    id: 'payment-3',
    date: '2023-11-15T09:15:00Z',
    plan: 'Уровень 2',
    amount: 15.00,
    currency: '$',
    status: 'paid',
    invoiceNumber: 'INV-2023-011',
    paymentMethod: 'MasterCard ****5678',
    details: {
      chatsCount: 67,
      messagesCount: 811,
      tokensUsed: 28750,
      mentorsUsed: ['Бизнес-консультант Анна', 'IT-архитектор Дмитрий', 'Психолог София'],
      timeInSystem: 4200, // 70 часов
      featuresUsed: ['Персональный ментор', 'API доступ', 'Приоритетная поддержка', 'Расширенный экспорт'],
      averageSessionTime: 63,
      peakUsageDay: '2023-11-22'
    }
  },
  {
    id: 'payment-4',
    date: '2023-10-15T16:45:00Z',
    plan: 'Уровень 1',
    amount: 5.00,
    currency: '$',
    status: 'paid',
    invoiceNumber: 'INV-2023-010',
    paymentMethod: 'Visa ****1234',
    details: {
      chatsCount: 28,
      messagesCount: 160,
      tokensUsed: 8930,
      mentorsUsed: ['Фитнес-тренер Алексей'],
      timeInSystem: 1560, // 26 часов
      featuresUsed: ['Персональный анализ', 'Экспорт чатов'],
      averageSessionTime: 42,
      peakUsageDay: '2023-10-20'
    }
  },
  {
    id: 'payment-5',
    date: '2023-09-15T11:30:00Z',
    plan: 'Бесплатно',
    amount: 0.00,
    currency: '$',
    status: 'paid',
    invoiceNumber: 'INV-2023-009',
    paymentMethod: 'Бесплатный план',
    details: {
      chatsCount: 12,
      messagesCount: 41,
      tokensUsed: 2340,
      mentorsUsed: [],
      timeInSystem: 480, // 8 часов
      featuresUsed: ['Базовые промпты', 'История чатов (7 дней)'],
      averageSessionTime: 25,
      peakUsageDay: '2023-09-18'
    }
  },
  {
    id: 'payment-6',
    date: '2023-08-15T13:20:00Z',
    plan: 'Уровень 1',
    amount: 5.00,
    currency: '$',
    status: 'failed',
    invoiceNumber: 'INV-2023-008',
    paymentMethod: 'Visa ****1234',
    details: {
      chatsCount: 0,
      messagesCount: 0,
      tokensUsed: 0,
      mentorsUsed: [],
      timeInSystem: 0,
      featuresUsed: [],
      averageSessionTime: 0,
      peakUsageDay: ''
    }
  }
];

export function PaymentsSection() {
  // Состояние данных
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  
  // Состояние для методов платежа
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);
  
  // Форма нового метода платежа
  const [newMethodForm, setNewMethodForm] = useState({
    type: 'visa' as PaymentMethod['type'],
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: '',
    isDefault: false
  });
  
  // Состояние UI
  const [loading, setLoading] = useState(false);

  // Форматирование цены
  const formatPrice = (amount: number, currency: string) => {
    if (amount === 0) return 'Бесплатно';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Форматирование времени
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}м`;
    if (mins === 0) return `${hours}ч`;
    return `${hours}ч ${mins}м`;
  };

  // Форматирование числа с разделителями
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Получить цвет статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Получить текст статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает';
      case 'failed': return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  // Обработка клика по строке платежа
  const handlePaymentClick = (payment: PaymentRecord) => {
    if (expandedPayment === payment.id) {
      setExpandedPayment(null);
      setSelectedPayment(null);
    } else {
      setExpandedPayment(payment.id);
      setSelectedPayment(payment);
    }
  };

  // Скачивание PDF
  const handleDownloadPDF = async (payment: PaymentRecord, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем открытие детализации
    
    setLoading(true);
    
    // Имитация генерации и скачивания PDF
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Создаем фиктивную ссылку для скачивания
    const link = document.createElement('a');
    link.href = '#'; // В реальном приложении здесь будет URL PDF
    link.download = `invoice-${payment.invoiceNumber}.pdf`;
    link.click();
    
    setLoading(false);
  };

  // Получить название типа карты
  const getCardTypeName = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'MasterCard';
      case 'paypal': return 'PayPal';
      case 'apple_pay': return 'Apple Pay';
      default: return 'Карта';
    }
  };

  // Получить цвет для типа карты
  const getCardTypeColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'visa': return 'bg-blue-600';
      case 'mastercard': return 'bg-red-500';
      case 'paypal': return 'bg-blue-500';
      case 'apple_pay': return 'bg-gray-900';
      default: return 'bg-gray-500';
    }
  };

  // Открыть форму добавления метода
  const handleAddMethod = () => {
    setShowAddMethodForm(true);
    setEditingMethod(null);
    setNewMethodForm({
      type: 'visa',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      holderName: '',
      isDefault: false
    });
  };

  // Редактировать метод
  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setShowAddMethodForm(true);
    setNewMethodForm({
      type: method.type,
      cardNumber: `****${method.last4}`,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvc: '',
      holderName: method.holderName,
      isDefault: method.isDefault
    });
  };

  // Удалить метод
  const handleDeleteMethod = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setShowDeleteConfirm(true);
  };

  // Подтвердить удаление
  const handleConfirmDelete = async () => {
    if (!methodToDelete) return;
    
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPaymentMethods(prev => prev.filter(method => method.id !== methodToDelete.id));
    setShowDeleteConfirm(false);
    setMethodToDelete(null);
    setLoading(false);
  };

  // Сохранить метод платежа
  const handleSaveMethod = async () => {
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (editingMethod) {
      // Обновляем существующий метод
      setPaymentMethods(prev => 
        prev.map(method => 
          method.id === editingMethod.id 
            ? {
                ...method,
                type: newMethodForm.type,
                expiryMonth: newMethodForm.expiryMonth,
                expiryYear: newMethodForm.expiryYear,
                holderName: newMethodForm.holderName,
                isDefault: newMethodForm.isDefault
              }
            : method
        )
      );
    } else {
      // Добавляем новый метод
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        type: newMethodForm.type,
        last4: newMethodForm.cardNumber.slice(-4),
        expiryMonth: newMethodForm.expiryMonth,
        expiryYear: newMethodForm.expiryYear,
        holderName: newMethodForm.holderName,
        isDefault: newMethodForm.isDefault,
        addedAt: new Date().toISOString()
      };
      
      setPaymentMethods(prev => [...prev, newMethod]);
    }
    
    setShowAddMethodForm(false);
    setEditingMethod(null);
    setLoading(false);
  };

  // Проверка валидности формы
  const isFormValid = () => {
    return newMethodForm.cardNumber.length >= 4 && 
           newMethodForm.expiryMonth && 
           newMethodForm.expiryYear && 
           newMethodForm.holderName.trim() &&
           (editingMethod || newMethodForm.cvc.length >= 3);
  };

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">История платежей</h2>
          <p className="text-gray-600">Все ваши транзакции и счета в одном месте</p>
        </div>
        <button
          onClick={() => setShowPaymentMethodsModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Методы платежа
        </button>
      </div>

      {/* Таблица платежей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тариф
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Номер счета
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Способ оплаты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <React.Fragment key={payment.id}>
                  <tr
                    onClick={() => handlePaymentClick(payment)}
                    className={`cursor-pointer transition-colors ${
                      expandedPayment === payment.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-25 hover:bg-gray-75'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(payment.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.plan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleDownloadPDF(payment, e)}
                          disabled={loading || payment.status !== 'paid'}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          PDF
                        </button>
                        <div className="text-gray-400">
                          {expandedPayment === payment.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Детализация платежа */}
                  {expandedPayment === payment.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-6 bg-blue-50 border-l-4 border-l-blue-500">
                        <div className="max-w-6xl">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Детализация использования за период
                            </h3>
                            <span className="text-sm text-gray-500">
                              {payment.invoiceNumber}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Левая колонка - Основная статистика */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 mb-4">Активность</h4>
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                                    <MessageCircle className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Чатов создано</div>
                                      <div className="text-sm text-gray-600">{formatNumber(payment.details.chatsCount)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <MessageCircle className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Сообщений отправлено</div>
                                      <div className="text-sm text-gray-600">{formatNumber(payment.details.messagesCount)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Zap className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Токенов использовано</div>
                                      <div className="text-sm text-gray-600">{formatNumber(payment.details.tokensUsed)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Время в системе</div>
                                      <div className="text-sm text-gray-600">{formatTime(payment.details.timeInSystem)}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Средняя сессия</div>
                                      <div className="text-sm text-gray-600">{formatTime(payment.details.averageSessionTime)}</div>
                                    </div>
                                  </div>
                                  {payment.details.peakUsageDay && (
                                    <div className="flex items-center space-x-3">
                                      <Calendar className="w-5 h-5 text-gray-400" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">Пик активности</div>
                                        <div className="text-sm text-gray-600">{formatDate(payment.details.peakUsageDay)}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Средняя колонка - Менторы */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 mb-4">Использованные менторы</h4>
                                {payment.details.mentorsUsed.length === 0 ? (
                                  <div className="text-center py-4">
                                    <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Менторы не использовались</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {payment.details.mentorsUsed.map((mentor, index) => (
                                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                          <Bot className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium text-gray-900">{mentor}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Правая колонка - Функции */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-base font-semibold text-gray-900 mb-4">Использованные функции</h4>
                                {payment.details.featuresUsed.length === 0 ? (
                                  <div className="text-center py-4">
                                    <div className="w-8 h-8 text-gray-300 mx-auto mb-2">⚡</div>
                                    <p className="text-sm text-gray-500">Дополнительные функции не использовались</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {payment.details.featuresUsed.map((feature, index) => (
                                      <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-200">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-900">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Сводка */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Сводка платежей</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatPrice(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0), '$')}
            </div>
            <div className="text-gray-600">Всего оплачено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {payments.filter(p => p.status === 'paid').length}
            </div>
            <div className="text-gray-600">Успешных платежей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {payments.filter(p => p.status === 'failed').length}
            </div>
            <div className="text-gray-600">Неудачных платежей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatDate(payments[0]?.date || new Date().toISOString())}
            </div>
            <div className="text-gray-600">Последний платеж</div>
          </div>
        </div>
      </div>

      {/* Модальное окно методов платежа */}
      {showPaymentMethodsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Методы платежа</h2>
                  <p className="text-sm text-gray-500">Управление способами оплаты</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentMethodsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {!showAddMethodForm ? (
                <>
                  {/* Таблица методов платежа */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Тип карты
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Номер
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Срок действия
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Владелец
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentMethods.map((method) => (
                            <tr key={method.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`w-8 h-5 rounded-sm mr-3 ${getCardTypeColor(method.type)}`}></div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {getCardTypeName(method.type)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  •••• •••• •••• {method.last4}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {method.expiryMonth}/{method.expiryYear}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {method.holderName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {method.isDefault ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    По умолчанию
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-500">Дополнительная</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditMethod(method)}
                                    className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    title="Редактировать"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMethod(method)}
                                    disabled={method.isDefault}
                                    className="inline-flex items-center p-1.5 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Удалить"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Кнопка добавления */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleAddMethod}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Добавить способ оплаты
                    </button>
                  </div>
                </>
              ) : (
                /* Форма добавления/редактирования метода */
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {editingMethod ? 'Редактировать способ оплаты' : 'Добавить способ оплаты'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingMethod ? 'Обновите информацию о способе оплаты' : 'Добавьте новую банковскую карту'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Тип карты */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Тип карты
                      </label>
                      <select
                        value={newMethodForm.type}
                        onChange={(e) => setNewMethodForm(prev => ({ ...prev, type: e.target.value as PaymentMethod['type'] }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">MasterCard</option>
                        <option value="paypal">PayPal</option>
                        <option value="apple_pay">Apple Pay</option>
                      </select>
                    </div>

                    {/* Номер карты */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Номер карты
                      </label>
                      <input
                        type="text"
                        value={newMethodForm.cardNumber}
                        onChange={(e) => setNewMethodForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                        placeholder="1234 1234 1234 1234"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Срок действия и CVC */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Месяц
                        </label>
                        <input
                          type="text"
                          value={newMethodForm.expiryMonth}
                          onChange={(e) => setNewMethodForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                          placeholder="12"
                          maxLength={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Год
                        </label>
                        <input
                          type="text"
                          value={newMethodForm.expiryYear}
                          onChange={(e) => setNewMethodForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                          placeholder="2026"
                          maxLength={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {!editingMethod && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={newMethodForm.cvc}
                            onChange={(e) => setNewMethodForm(prev => ({ ...prev, cvc: e.target.value }))}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                      )}
                    </div>

                    {/* Имя владельца */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя на карте
                      </label>
                      <input
                        type="text"
                        value={newMethodForm.holderName}
                        onChange={(e) => setNewMethodForm(prev => ({ ...prev, holderName: e.target.value }))}
                        placeholder="Alexey Petrov"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Сделать по умолчанию */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newMethodForm.isDefault}
                        onChange={(e) => setNewMethodForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Использовать как основной способ оплаты
                      </label>
                    </div>
                  </div>

                  {/* Кнопки формы */}
                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      onClick={() => setShowAddMethodForm(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSaveMethod}
                      disabled={!isFormValid() || loading}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Сохранение...
                        </div>
                      ) : (
                        'Подтвердить'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && methodToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Подтвердите удаление</h2>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Вы уверены, что хотите удалить способ оплаты <strong>{getCardTypeName(methodToDelete.type)} ****{methodToDelete.last4}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Это действие нельзя отменить. Способ оплаты будет удален навсегда.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Удаление...
                  </div>
                ) : (
                  'Удалить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}