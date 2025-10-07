import React, { useState, useEffect } from 'react';
import { Edit, Plus, Check, ChevronDown } from 'lucide-react';

// Типы данных
interface PromptVersion {
  id: string;
  content: string;
  notes: string;
  type: 'user' | 'assistant' | 'developer';
  createdAt: string;
  isActive: boolean;
}

interface Prompt {
  id: string;
  name: string;
  versions: PromptVersion[];
}

// Mock данные для демонстрации
const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'prompt-1',
    name: 'Системный промпт для чата',
    versions: [
      {
        id: 'v1',
        content: 'Ты полезный AI ассистент. Отвечай кратко и по делу. Будь дружелюбным и профессиональным.',
        notes: 'Базовая версия системного промпта для общего чата',
        type: 'assistant',
        createdAt: '2024-01-15T10:30:00Z',
        isActive: true
      },
      {
        id: 'v2',
        content: 'Ты AI ассистент. Помогай пользователям с их вопросами.',
        notes: 'Упрощенная версия промпта',
        type: 'assistant',
        createdAt: '2024-01-10T14:20:00Z',
        isActive: false
      }
    ]
  },
  {
    id: 'prompt-2',
    name: 'Промпт для анализа пользователя',
    versions: [
      {
        id: 'v1',
        content: 'Анализируй интересы пользователя на основе его вопросов. Выдели ключевые темы.',
        notes: 'Промпт для персонального анализа в режиме "Мой вопрос"',
        type: 'developer',
        createdAt: '2024-01-12T09:15:00Z',
        isActive: false
      }
    ]
  }
];

const PROMPT_TYPES = [
  { value: 'user', label: 'Пользовательский', color: 'bg-green-100 text-green-800' },
  { value: 'assistant', label: 'Ассистент', color: 'bg-blue-100 text-blue-800' },
  { value: 'developer', label: 'Девелопер', color: 'bg-purple-100 text-purple-800' }
];

export function PromptsSection() {
  // Состояние данных
  const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  
  // Состояние UI
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Состояние форм
  const [editContent, setEditContent] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editType, setEditType] = useState<'user' | 'assistant' | 'developer'>('assistant');
  const [newPromptName, setNewPromptName] = useState('');

  // Инициализация - находим активный промпт
  useEffect(() => {
    const activePromptData = prompts.find(p => 
      p.versions.some(v => v.isActive)
    );
    
    if (activePromptData) {
      setActivePrompt(activePromptData);
      const activeVersion = activePromptData.versions.find(v => v.isActive);
      setSelectedVersion(activeVersion || activePromptData.versions[0]);
    }
  }, [prompts]);

  // Получить тип промпта с цветом
  const getPromptTypeInfo = (type: string) => {
    return PROMPT_TYPES.find(t => t.value === type) || PROMPT_TYPES[1];
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

  // Выбор версии из таблицы
  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version);
  };

  // Сделать версию активной
  const handleMakeActive = async (versionId: string) => {
    if (!activePrompt) return;
    
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => ({
        ...prompt,
        versions: prompt.versions.map(version => ({
          ...version,
          isActive: version.id === versionId && prompt.id === activePrompt.id
        }))
      }))
    );
    
    setLoading(false);
  };

  // Начать создание нового промпта
  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditContent('');
    setEditNotes('');
    setEditType('assistant');
    setNewPromptName('');
  };

  // Начать редактирование
  const handleStartEdit = () => {
    if (!selectedVersion) return;
    
    setIsEditing(true);
    setIsCreating(false);
    setEditContent(selectedVersion.content);
    setEditNotes(selectedVersion.notes);
    setEditType(selectedVersion.type);
  };

  // Подтвердить создание
  const handleConfirmCreate = async () => {
    if (!editContent.trim() || !newPromptName.trim()) return;
    
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPrompt: Prompt = {
      id: `prompt-${Date.now()}`,
      name: newPromptName,
      versions: [{
        id: `v${Date.now()}`,
        content: editContent,
        notes: editNotes,
        type: editType,
        createdAt: new Date().toISOString(),
        isActive: false
      }]
    };
    
    setPrompts(prev => [...prev, newPrompt]);
    setIsCreating(false);
    setLoading(false);
    
    // Переключаемся на новый промпт
    setActivePrompt(newPrompt);
    setSelectedVersion(newPrompt.versions[0]);
  };

  // Подтвердить редактирование
  const handleConfirmEdit = async () => {
    if (!activePrompt || !selectedVersion || !editContent.trim()) return;
    
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newVersion: PromptVersion = {
      id: `v${Date.now()}`,
      content: editContent,
      notes: editNotes,
      type: editType,
      createdAt: new Date().toISOString(),
      isActive: false
    };
    
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === activePrompt.id 
          ? { ...prompt, versions: [newVersion, ...prompt.versions] }
          : prompt
      )
    );
    
    setIsEditing(false);
    setLoading(false);
    
    // Обновляем активный промпт и выбираем новую версию
    const updatedPrompt = { ...activePrompt, versions: [newVersion, ...activePrompt.versions] };
    setActivePrompt(updatedPrompt);
    setSelectedVersion(newVersion);
  };

  // Отмена редактирования/создания
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditContent('');
    setEditNotes('');
    setNewPromptName('');
  };

  if (!activePrompt) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Промпты не найдены</p>
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать первый промпт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 1. Название активного промпта */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isCreating ? 'Создание нового промпта' : activePrompt.name}
        </h2>
        {!isCreating && (
          <p className="text-sm text-gray-500 mt-1">
            Активная версия: {selectedVersion ? formatDate(selectedVersion.createdAt) : 'Не выбрана'}
          </p>
        )}
      </div>

      {/* 2. Таблица "История активного промпта" */}
      {!isCreating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">История активного промпта</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Версия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата обновления
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
                {activePrompt.versions.map((version, index) => {
                  const typeInfo = getPromptTypeInfo(version.type);
                  const isSelected = selectedVersion?.id === version.id;
                  
                  return (
                    <tr
                      key={version.id}
                      onClick={() => handleVersionSelect(version)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Версия {activePrompt.versions.length - index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(version.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {version.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Активен
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Неактивен</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {!version.isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMakeActive(version.id);
                            }}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                          >
                            Сделать активным
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Окно промпта */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isCreating ? 'Новый промпт' : 'Содержимое промпта'}
            </h3>
            {!isCreating && selectedVersion && (
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPromptTypeInfo(selectedVersion.type).color}`}>
                  {getPromptTypeInfo(selectedVersion.type).label}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedVersion.createdAt)}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {!isEditing && !isCreating && (
              <>
                <button
                  onClick={handleStartEdit}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Изменить
                </button>
                <button
                  onClick={handleStartCreate}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать
                </button>
              </>
            )}
            {(isEditing || isCreating) && (
              <>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={isCreating ? handleConfirmCreate : handleConfirmEdit}
                  disabled={loading || !editContent.trim() || (isCreating && !newPromptName.trim())}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Подтвердить
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Поле названия промпта (только при создании) */}
          {isCreating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название промпта
              </label>
              <input
                type="text"
                value={newPromptName}
                onChange={(e) => setNewPromptName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите название промпта"
              />
            </div>
          )}

          {/* Выпадающий список типа (при редактировании/создании) */}
          {(isEditing || isCreating) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип промпта
              </label>
              <div className="relative">
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as 'user' | 'assistant' | 'developer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {PROMPT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Содержимое промпта */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержимое промпта
            </label>
            {isEditing || isCreating ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите содержимое промпта"
              />
            ) : (
              <div className="w-full min-h-[200px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                  {selectedVersion?.content || 'Содержимое не выбрано'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Окно примечаний */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Примечания</h3>
        </div>
        <div className="p-6">
          {isEditing || isCreating ? (
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите примечания к промпту"
            />
          ) : (
            <div className="w-full min-h-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {selectedVersion?.notes || 'Примечания отсутствуют'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}