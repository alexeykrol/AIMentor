import React from 'react';
import { Wallet, CreditCard, Plus, TrendingUp, DollarSign, Clock } from 'lucide-react';

export function BalanceSection() {
  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Баланс и токены</h2>
        <p className="text-gray-600">Управление вашим балансом и использованием токенов</p>
      </div>

      {/* Основной баланс */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">Пополнить</button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Текущий баланс</p>
            <p className="text-2xl font-bold text-gray-900">₽2,450</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Активна</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Подписка Pro</p>
            <p className="text-2xl font-bold text-gray-900">₽999/мес</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">за месяц</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Потрачено</p>
            <p className="text-2xl font-bold text-gray-900">₽1,245</p>
          </div>
        </div>
      </div>

      {/* Использование токенов */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Использование токенов</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12.5K</div>
            <div className="text-sm text-gray-500">Входящие</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8.2K</div>
            <div className="text-sm text-gray-500">Исходящие</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">20.7K</div>
            <div className="text-sm text-gray-500">Всего</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">₽415</div>
            <div className="text-sm text-gray-500">Стоимость</div>
          </div>
        </div>
      </div>

      {/* История операций */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Последние операции</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">Все операции</button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'spend', description: 'Чат с GPT-4', amount: '₽45', time: '2 часа назад' },
            { type: 'spend', description: 'Анализ документа', amount: '₽120', time: '5 часов назад' },
            { type: 'refill', description: 'Пополнение баланса', amount: '+₽500', time: 'вчера' },
            { type: 'spend', description: 'Генерация изображений', amount: '₽80', time: '2 дня назад' },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'refill' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'refill' ? (
                    <Plus className="w-4 h-4 text-green-600" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {transaction.time}
                  </div>
                </div>
              </div>
              <div className={`text-sm font-medium ${
                transaction.type === 'refill' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Пополнить баланс</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors">
          <TrendingUp className="w-5 h-5" />
          <span>Аналитика расходов</span>
        </button>
      </div>
    </div>
  );
}