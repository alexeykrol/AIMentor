import React, { useState } from 'react';
import { Check, Crown, Zap, Star, CreditCard, X } from 'lucide-react';

// Типы данных
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
  buttonText: string;
  buttonColor: string;
}

// Mock данные тарифных планов
const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Бесплатно',
    price: 0,
    currency: '$',
    period: 'навсегда',
    description: 'Базовые возможности для знакомства с системой',
    features: [
      '5 вопросов в день',
      'Базовые промпты',
      'История чатов (7 дней)',
      'Стандартная скорость ответов',
      'Поддержка через FAQ'
    ],
    buttonText: 'Понизить',
    buttonColor: 'bg-red-600 text-white hover:bg-red-700',
    current: false
  },
  {
    id: 'level1',
    name: 'Уровень 1',
    price: 5,
    currency: '$',
    period: 'месяц',
    description: 'Для активных пользователей с регулярными потребностями',
    features: [
      '100 вопросов в день',
      'Все базовые промпты',
      'История чатов (30 дней)',
      'Быстрая скорость ответов',
      'Email поддержка',
      'Экспорт чатов',
      'Персональный анализ'
    ],
    buttonText: 'Текущий план',
    buttonColor: 'bg-blue-100 text-blue-800',
    current: true
  },
  {
    id: 'level2',
    name: 'Уровень 2',
    price: 15,
    currency: '$',
    period: 'месяц',
    description: 'Для профессионалов и команд',
    features: [
      'Неограниченные вопросы',
      'Все промпты + премиум',
      'Безлимитная история',
      'Приоритетная скорость',
      'Приоритетная поддержка',
      'Расширенный экспорт',
      'Персональный ментор',
      'API доступ',
      'Командные функции'
    ],
    popular: true,
    buttonText: 'Повысить',
    buttonColor: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  {
    id: 'level3',
    name: 'Уровень 3',
    price: 34,
    currency: '$',
    period: 'месяц',
    description: 'Максимальные возможности для бизнеса',
    features: [
      'Все из Уровня 2',
      'Белый лейбл',
      'Кастомные промпты',
      'Интеграции с CRM',
      'Персональный менеджер',
      'SLA 99.9%',
      'Расширенная аналитика',
      'Корпоративная поддержка',
      'Обучение команды',
      'Кастомные интеграции'
    ],
    buttonText: 'Повысить',
    buttonColor: 'bg-purple-600 text-white hover:bg-purple-700'
  }
];

export function BillingSection() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [planForCheckout, setPlanForCheckout] = useState<PricingPlan | null>(null);

  // Форматирование цены
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Бесплатно';
    return `${currency}${price}`;
  };

  // Обработка смены тарифа
  const handlePlanChange = async (planId: string) => {
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) return;
    
    // Если это повышение тарифа (платные планы), показываем checkout
    if (plan.price > 0 && !plan.current) {
      setPlanForCheckout(plan);
      setShowCheckoutModal(true);
      return;
    }
    
    // Для понижения или бесплатных планов - прямое изменение
    setLoading(true);
    setSelectedPlan(planId);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Здесь будет логика смены тарифа
    console.log('Changing plan to:', planId);
    
    setLoading(false);
    setSelectedPlan(null);
  };

  // Завершение покупки подписки
  const handleSubscriptionPurchase = async () => {
    if (!planForCheckout) return;
    
    setLoading(true);
    
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Здесь будет логика смены тарифа после успешной оплаты
    console.log('Subscription purchased:', planForCheckout.id);
    
    setShowCheckoutModal(false);
    setPlanForCheckout(null);
    setLoading(false);
  };

  // Получить иконку для плана
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Star className="w-6 h-6" />;
      case 'level1': return <Zap className="w-6 h-6" />;
      case 'level2': return <Crown className="w-6 h-6" />;
      case 'level3': return <Crown className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Управление подпиской</h2>
        <p className="text-gray-600">Выберите тарифный план, который подходит вашим потребностям</p>
      </div>

      {/* Текущий уровень */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Ваш текущий уровень: Уровень 1</h3>
            <p className="text-sm text-blue-700">Следующее списание: 15 февраля 2024 ($5.00)</p>
          </div>
        </div>
      </div>

      {/* Тарифные планы */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
              plan.current 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : plan.popular 
                ? 'border-purple-500' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Популярный бейдж */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                  Популярный
                </span>
              </div>
            )}

            {/* Текущий план бейдж */}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                  Текущий план
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Заголовок плана */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.current 
                    ? 'bg-blue-100 text-blue-600' 
                    : plan.popular 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              {/* Список возможностей */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.current 
                        ? 'bg-blue-100' 
                        : plan.popular 
                        ? 'bg-purple-100' 
                        : 'bg-gray-100'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.current 
                          ? 'text-blue-600' 
                          : plan.popular 
                          ? 'text-purple-600' 
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Кнопка действия */}
              <button
                onClick={() => handlePlanChange(plan.id)}
                disabled={loading && selectedPlan === plan.id || plan.current}
                className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.current 
                    ? 'bg-gray-100 text-gray-800 cursor-default' 
                    : plan.buttonColor
                }`}
              >
                {loading && selectedPlan === plan.id ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Обработка...
                  </div>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Дополнительная информация */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">💳 Способы оплаты</h4>
            <p>Принимаем все основные банковские карты, PayPal и криптовалюты</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🔄 Отмена подписки</h4>
            <p>Отменить можно в любой момент. Доступ сохраняется до конца оплаченного периода</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📞 Поддержка</h4>
            <p>Техническая поддержка 24/7 для всех платных планов</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Часто задаваемые вопросы</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Можно ли изменить план в любое время?</h4>
            <p className="text-sm text-gray-600">Да, вы можете обновить или понизить план в любой момент. При обновлении доплачиваете разницу, при понижении кредит переносится на следующий период.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Что происходит при отмене подписки?</h4>
            <p className="text-sm text-gray-600">Ваш аккаунт автоматически переводится на бесплатный план в конце текущего оплаченного периода. Все данные сохраняются.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Есть ли корпоративные тарифы?</h4>
            <p className="text-sm text-gray-600">Да, для команд от 10 человек мы предлагаем специальные корпоративные тарифы с дополнительными возможностями. Свяжитесь с нами для обсуждения.</p>
          </div>
        </div>
      </div>

      {/* Модальное окно оплаты подписки */}
      {showCheckoutModal && planForCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Заголовок в стиле Stripe */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">Обновление подписки</h2>
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
                        placeholder="alex.petrov@gmail.com"
                        defaultValue="alex.petrov@gmail.com"
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
                        placeholder="Alexey Petrov"
                        defaultValue="Alexey Petrov"
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
                    onClick={handleSubscriptionPurchase}
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Обработка платежа...
                      </div>
                    ) : (
                      `Оплатить ${formatPrice(planForCheckout.price, planForCheckout.currency)}/${planForCheckout.period}`
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
                
                {/* Информация о плане */}
                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      planForCheckout.popular 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getPlanIcon(planForCheckout.id)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{planForCheckout.name}</h4>
                      <p className="text-sm text-gray-600">{planForCheckout.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(planForCheckout.price, planForCheckout.currency)}
                    </div>
                    <div className="text-sm text-gray-500">за {planForCheckout.period}</div>
                  </div>
                </div>

                {/* Детали оплаты */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Стоимость подписки</span>
                    <span className="font-medium">{formatPrice(planForCheckout.price, planForCheckout.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Налоги</span>
                    <span className="font-medium">Включены</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Итого</span>
                      <span className="font-bold text-xl text-blue-600">{formatPrice(planForCheckout.price, planForCheckout.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Гарантии */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Что вы получаете</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Мгновенная активация</li>
                    <li>• Возврат средств в течение 14 дней</li>
                    <li>• Отмена в любое время</li>
                    <li>• Техническая поддержка 24/7</li>
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