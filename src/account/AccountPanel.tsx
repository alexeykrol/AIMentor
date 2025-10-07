import React, { useState } from 'react';
import { Settings, Users, Database, BarChart3, Shield, ArrowLeft, FileText, FolderOpen, TrendingUp, BookOpen, User, CreditCard, Receipt, Bell, Key, HelpCircle, Phone, Bot, Wallet, Share2, GraduationCap, MessageCircle, Clock, Zap, Check, Star, Mail } from 'lucide-react';
import { LibrarySection } from './LibrarySection';
import { BillingSection } from './BillingSection';
import { PaymentsSection } from './PaymentsSection';
import { EducationSection } from './EducationSection';
import { HelpSection } from './HelpSection';
import { BalanceSection } from './BalanceSection';
import { StatisticsSection } from './StatisticsSection';

interface AccountPanelProps {
  onClose: () => void;
}

type MenuItemType = 'mentor' | 'balance' | 'referral' | 'library' | 'settings' | 'billing' | 'payments' | 'notifications' | 'security' | 'privacy' | 'education' | 'help' | 'contact' | 'profile' | 'training' | 'statistics' | 'share';

const MENU_ITEMS = [
  // Первая группа
  { id: 'mentor' as MenuItemType, title: 'Мой ментор', icon: Bot },
  { id: 'library' as MenuItemType, title: 'Библиотека', icon: BookOpen },
  { id: 'balance' as MenuItemType, title: 'Баланс', icon: Wallet },
  { id: 'statistics' as MenuItemType, title: 'Статистика', icon: BarChart3 },
  // Вторая группа
  { id: 'profile' as MenuItemType, title: 'Профиль', icon: User },
  { id: 'settings' as MenuItemType, title: 'Настройки', icon: Settings },
  { id: 'billing' as MenuItemType, title: 'Подписка', icon: CreditCard },
  { id: 'payments' as MenuItemType, title: 'Платежи', icon: Receipt },
  { id: 'notifications' as MenuItemType, title: 'Уведомления', icon: Bell },
  { id: 'security' as MenuItemType, title: 'Безопасность', icon: Shield },
  { id: 'privacy' as MenuItemType, title: 'Приватность', icon: Key },
  // Третья группа
  { id: 'education' as MenuItemType, title: 'Обучение', icon: GraduationCap },
  { id: 'help' as MenuItemType, title: 'Помощь', icon: HelpCircle },
  { id: 'contact' as MenuItemType, title: 'Контакты', icon: Mail },
];

export function AccountPanel({ onClose }: AccountPanelProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>('balance');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'education':
        return (
          <>
            <EducationSection />
          </>
        );
      case 'balance':
        return <BalanceSection />;
      case 'statistics':
        return <StatisticsSection />;
      case 'mentor':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Баланс и токены</h3>
            <p className="text-gray-600">Здесь будет интерфейс управления балансом</p>
          </div>
        );
      case 'referral':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Реферальная программа</h3>
            <p className="text-gray-600">Здесь будет интерфейс реферальной программы</p>
          </div>
        );
      case 'library':
        return <LibrarySection />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Заголовок */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Профиль пользователя</h2>
              <p className="text-gray-600">Управление основной информацией вашего аккаунта</p>
            </div>

            {/* Основная информация */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Основная информация</h3>
              
              <div className="flex items-start space-x-6 mb-8">
                {/* Аватар */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Изменить фото
                  </button>
                </div>
                
                {/* Форма профиля */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <input
                      type="text"
                      defaultValue="Алексей"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Фамилия</label>
                    <input
                      type="text"
                      defaultValue="Петров"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="alex.petrov@gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение</label>
                    <input
                      type="text"
                      defaultValue="Москва, Россия"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Сохранить изменения
                </button>
              </div>
            </div>

            {/* Информация об аккаунте */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Информация об аккаунте</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Тип подписки</div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Уровень 1
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">ID пользователя</div>
                      <div className="text-sm text-gray-600 font-mono">usr_2024_alex_petrov</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400 flex items-center justify-center">📅</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Дата регистрации</div>
                      <div className="text-sm text-gray-600">15 января 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400 flex items-center justify-center">🕒</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Последняя активность</div>
                      <div className="text-sm text-gray-600">Сегодня в 14:25</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Статус анализа */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Персональный анализ</h3>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 text-green-600">✓</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">Анализ завершен</div>
                  <div className="text-sm text-gray-600">Персональные вопросы готовы к использованию</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Программирование', 'ИИ', 'Стартапы', 'Технологии'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Пересдать анализ
                </button>
              </div>
            </div>
          </div>
        );
      case 'training':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Обучение и развитие</h3>
            <p className="text-gray-600">Здесь будет раздел обучения и развития навыков</p>
          </div>
        );
      case 'payments':
        return (
          <PaymentsSection />
        );
      case 'help':
        return (
          <HelpSection />
        );
      case 'contact':
        return (
          <div className="w-full space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Контакты</h2>
              <p className="text-gray-600">Связь с поддержкой и командой</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Контакты</h3>
              <p className="text-gray-500">Здесь будет информация для связи</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="w-full space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Настройки</h2>
              <p className="text-gray-600">Персональные настройки системы</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Настройки</h3>
              <p className="text-gray-500">Здесь будут настройки системы</p>
            </div>
          </div>
        );
      case 'billing':
        return (
          <BillingSection />
        );
      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Настройки уведомлений</h3>
            
            {/* Email уведомления */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Email уведомления</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Новые функции</div>
                    <div className="text-xs text-gray-500">Уведомления о новых возможностях системы</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Акции и скидки</div>
                    <div className="text-xs text-gray-500">Специальные предложения и промокоды</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Еженедельная сводка</div>
                    <div className="text-xs text-gray-500">Статистика использования за неделю</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Платежи и счета</div>
                    <div className="text-xs text-gray-500">Уведомления о списаниях и счетах</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Push уведомления */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Push уведомления</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Уведомления в браузере</div>
                    <div className="text-xs text-gray-500">Показывать уведомления даже когда вкладка неактивна</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Завершение анализа</div>
                    <div className="text-xs text-gray-500">Уведомление когда персональный анализ готов</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Напоминания о неактивности</div>
                    <div className="text-xs text-gray-500">Напоминать о возвращении после 7 дней отсутствия</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Частота уведомлений */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Частота уведомлений</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <input type="radio" name="frequency" value="realtime" defaultChecked className="mb-2" />
                    <div className="text-sm font-medium text-gray-900">В реальном времени</div>
                    <div className="text-xs text-gray-500">Мгновенные уведомления</div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <input type="radio" name="frequency" value="daily" className="mb-2" />
                    <div className="text-sm font-medium text-gray-900">Ежедневно</div>
                    <div className="text-xs text-gray-500">Сводка в конце дня</div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <input type="radio" name="frequency" value="weekly" className="mb-2" />
                    <div className="text-sm font-medium text-gray-900">Еженедельно</div>
                    <div className="text-xs text-gray-500">Сводка раз в неделю</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Тестовые уведомления */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Тестирование</h4>
              <p className="text-sm text-gray-600 mb-4">
                Проверьте, как работают уведомления
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Тест Email
                </button>
                <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Тест Push
                </button>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Безопасность аккаунта</h3>
            
            {/* Смена пароля */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Смена пароля</h4>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите текущий пароль"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите новый пароль"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите новый пароль
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Повторите новый пароль"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Изменить пароль
                </button>
              </div>
            </div>

            {/* Двухфакторная аутентификация */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Двухфакторная аутентификация</h4>
                  <p className="text-sm text-gray-600">Дополнительная защита вашего аккаунта</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="text-sm text-gray-600">
                <p>Включите 2FA для дополнительной защиты. Вам потребуется приложение-аутентификатор (Google Authenticator, Authy).</p>
              </div>
            </div>

            {/* Активные сессии */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Активные сессии</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Текущая сессия</div>
                      <div className="text-xs text-gray-500">Chrome на Windows • Москва, Россия</div>
                    </div>
                  </div>
                  <span className="text-xs text-green-700 font-medium">Активна</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">iPhone Safari</div>
                      <div className="text-xs text-gray-500">2 часа назад • Москва, Россия</div>
                    </div>
                  </div>
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium">
                    Завершить
                  </button>
                </div>
              </div>
            </div>

            {/* История входов */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">История входов</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Устройство</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Местоположение</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP адрес</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">20.01.2024 15:45</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Chrome на Windows</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Москва, Россия</td>
                      <td className="px-4 py-3 text-sm text-gray-500">192.168.1.1</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">20.01.2024 13:20</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Safari на iPhone</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Москва, Россия</td>
                      <td className="px-4 py-3 text-sm text-gray-500">192.168.1.2</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">19.01.2024 18:30</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Firefox на Linux</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Санкт-Петербург, Россия</td>
                      <td className="px-4 py-3 text-sm text-gray-500">78.85.12.45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Настройки приватности</h3>
            
            {/* Видимость профиля */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Видимость профиля</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Публичный профиль</div>
                    <div className="text-xs text-gray-500">Другие пользователи могут видеть ваш профиль</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Показывать статистику</div>
                    <div className="text-xs text-gray-500">Отображать количество чатов и активность</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Показывать интересы</div>
                    <div className="text-xs text-gray-500">Отображать ваши любимые темы</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-4 lg:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Мой аккаунт</h1>
                <p className="text-sm text-gray-500">Управление профилем и настройками</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Menu */}
        <div className="w-48 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-0.5">
                {MENU_ITEMS.map((item, index) => {
                  const IconComponent = item.icon;
                  
                  // Добавляем разделитель после "Статистика" (индекс 3)
                  if (index === 4) {
                    return (
                      <React.Fragment key={`separator-after-${index}`}>
                        <div className="my-2 border-t border-gray-200"></div>
                        <button
                          onClick={() => setSelectedMenuItem(item.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                            selectedMenuItem === item.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-normal text-gray-900">
                            {item.title}
                          </span>
                        </button>
                      </React.Fragment>
                    );
                  }
                  
                  // Добавляем разделитель после "Приватность" (индекс 10)
                  const showDivider = index === 10;
                  
                  return (
                    <React.Fragment key={item.id}>
                      <button
                        onClick={() => setSelectedMenuItem(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                          selectedMenuItem === item.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-normal text-gray-900">
                          {item.title}
                        </span>
                      </button>
                      {showDivider && (
                        <div className="mx-3 my-2 border-t border-gray-200"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            <div className="w-full">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}