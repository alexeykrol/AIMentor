import React, { useState } from 'react';
import { Settings, Users, Database, BarChart3, Shield, ArrowLeft, FileText, FolderOpen, TrendingUp, BookOpen } from 'lucide-react';
import { ConfigSection } from './ConfigSection';
import { PromptsSection } from './PromptsSection';
import { LibrarySection } from './LibrarySection';
import { FilesSection } from './FilesSection';
import { UsersSection } from './UsersSection';
import { AnalyticsSection } from './AnalyticsSection';

interface AdminPanelProps {
  onClose: () => void;
}

type MenuItemType = 'users' | 'roles' | 'activity' | 'database' | 'config' | 'logs' | 'prompts' | 'library' | 'files' | 'analytics';

const MENU_ITEMS = [
  { id: 'config' as MenuItemType, title: 'Настройка', icon: Settings },
  { id: 'prompts' as MenuItemType, title: 'Промпты', icon: FileText },
  { id: 'library' as MenuItemType, title: 'Библиотека', icon: BookOpen },
  { id: 'files' as MenuItemType, title: 'Файлы', icon: FolderOpen },
  { id: 'users' as MenuItemType, title: 'Пользователи', icon: Users },
  { id: 'analytics' as MenuItemType, title: 'Аналитика', icon: TrendingUp },
  // Разделитель
  { id: 'roles' as MenuItemType, title: 'Роли', icon: Shield },
  { id: 'activity' as MenuItemType, title: 'Активность', icon: BarChart3 },
  { id: 'database' as MenuItemType, title: 'Данные', icon: Database },
  { id: 'logs' as MenuItemType, title: 'Логи', icon: BarChart3 },
];

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>('config');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'users':
        return (
          <UsersSection />
        );
      case 'analytics':
        return (
          <AnalyticsSection />
        );
      case 'roles':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Роли и права</h3>
            <p className="text-gray-600">Здесь будет интерфейс управления ролями и правами</p>
          </div>
        );
      case 'activity':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Активность</h3>
            <p className="text-gray-600">Здесь будет интерфейс просмотра активности</p>
          </div>
        );
      case 'database':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">База данных</h3>
            <p className="text-gray-600">Здесь будет интерфейс управления базой данных</p>
          </div>
        );
      case 'config':
        return (
          <ConfigSection />
        );
      case 'prompts':
        return (
          <PromptsSection />
        );
      case 'library':
        return (
          <LibrarySection />
        );
      case 'files':
        return (
          <FilesSection />
        );
      case 'logs':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Логи системы</h3>
            <p className="text-gray-600">Здесь будет интерфейс просмотра логов</p>
          </div>
        );
      case 'prompts':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Промпты</h3>
            <p className="text-gray-600">Здесь будет интерфейс управления промптами</p>
          </div>
        );
      case 'files':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Файлы и шаблоны</h3>
            <p className="text-gray-600">Здесь будет интерфейс управления файлами и шаблонами</p>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Аналитика</h3>
            <p className="text-gray-600">Здесь будет интерфейс аналитики</p>
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
              <Shield className="h-8 w-8 text-gray-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
                <p className="text-sm text-gray-500">Управление системой</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Menu */}
        <div className="w-40 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-0.5">
                {MENU_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMenuItem(item.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        selectedMenuItem === item.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-gray-500" />
                      <span className="text-xs font-normal text-gray-900">
                        {item.title}
                      </span>
                    </button>
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