import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { AdminConfig, ConfigFormData, AI_PROVIDERS, AI_MODELS_BY_PROVIDER } from './types';

export function ConfigSection() {
  const [config, setConfig] = useState<ConfigFormData>({
    aiProvider: 'openai',
    aiModel: 'gpt-4',
    apiKey: '',
    analysisQuestions: 10,
    guestQuestions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Загрузка конфигурации при монтировании компонента
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      // TODO: Загрузка из API или localStorage
      const savedConfig = localStorage.getItem('adminConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Ошибка загрузки конфигурации:', error);
      setMessage({ type: 'error', text: 'Ошибка загрузки конфигурации' });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      // TODO: Сохранение через API
      localStorage.setItem('adminConfig', JSON.stringify(config));
      setMessage({ type: 'success', text: 'Конфигурация успешно сохранена' });
      
      // Скрыть сообщение через 3 секунды
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Ошибка сохранения конфигурации:', error);
      setMessage({ type: 'error', text: 'Ошибка сохранения конфигурации' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ConfigFormData, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setConfig({
      aiProvider: 'openai',
      aiModel: 'gpt-4',
      apiKey: '',
      analysisQuestions: 10,
      guestQuestions: 5,
    });
    setMessage(null);
  };

  // Получить доступные модели для выбранного провайдера
  const getAvailableModels = () => {
    return AI_MODELS_BY_PROVIDER[config.aiProvider as keyof typeof AI_MODELS_BY_PROVIDER] || [];
  };

  // Обработка изменения провайдера
  const handleProviderChange = (provider: string) => {
    const availableModels = AI_MODELS_BY_PROVIDER[provider as keyof typeof AI_MODELS_BY_PROVIDER];
    setConfig(prev => ({
      ...prev,
      aiProvider: provider,
      aiModel: availableModels?.[0]?.value || ''
    }));
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Загрузка конфигурации...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Конфигурация системы</h3>
          <p className="text-sm text-gray-500 mt-1">
            Настройки ИИ провайдера и параметры системы
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Сообщение об успехе/ошибке */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Выбор провайдера ИИ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выбор провайдера ИИ
            </label>
            <select
              value={config.aiProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {AI_PROVIDERS.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Выберите провайдера ИИ сервиса
            </p>
          </div>

          {/* API ключ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API ключ
            </label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите API ключ"
            />
            <p className="text-xs text-gray-500 mt-1">
              API ключ для подключения к выбранному провайдеру
            </p>
          </div>

          {/* Выбор модели */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выбор модели
            </label>
            <select
              value={config.aiModel}
              onChange={(e) => handleInputChange('aiModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {getAvailableModels().map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Выберите модель выбранного провайдера
            </p>
          </div>

          {/* Вопросов для анализа */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вопросов для анализа
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.analysisQuestions}
              onChange={(e) => handleInputChange('analysisQuestions', parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Количество вопросов для персонального анализа пользователя
            </p>
          </div>

          {/* Вопросов до регистрации */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вопросов до регистрации
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={config.guestQuestions}
              onChange={(e) => handleInputChange('guestQuestions', parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Количество вопросов, которые может задать гость до регистрации
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Сбросить
          </button>
          
          <button
            onClick={saveConfig}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}