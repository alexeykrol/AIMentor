import React, { useState, useEffect } from 'react';
import { Upload, Trash2, FileText, Image, FileVideo, Music, Archive, X, AlertTriangle, Check } from 'lucide-react';

// Типы данных
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  promptId: string;
}

interface PromptWithFiles {
  id: string;
  name: string;
  filesCount: number;
}

// Mock данные промптов
const MOCK_PROMPTS: PromptWithFiles[] = [
  { id: 'prompt-1', name: 'Системный промпт для чата', filesCount: 3 },
  { id: 'prompt-2', name: 'Промпт для анализа пользователя', filesCount: 0 },
  { id: 'prompt-3', name: 'Копирайтер для соцсетей', filesCount: 7 },
  { id: 'prompt-4', name: 'Code Review Assistant', filesCount: 2 },
  { id: 'prompt-5', name: 'Бизнес-план генератор', filesCount: 12 },
  { id: 'prompt-6', name: 'Креативный писатель', filesCount: 1 },
];

// Mock данные файлов
const MOCK_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'chat_guidelines.pdf',
    type: 'application/pdf',
    size: 245760,
    uploadedAt: '2024-01-15T10:30:00Z',
    promptId: 'prompt-1'
  },
  {
    id: 'file-2',
    name: 'conversation_examples.txt',
    type: 'text/plain',
    size: 15360,
    uploadedAt: '2024-01-14T14:20:00Z',
    promptId: 'prompt-1'
  },
  {
    id: 'file-3',
    name: 'brand_voice.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 87040,
    uploadedAt: '2024-01-13T09:15:00Z',
    promptId: 'prompt-1'
  },
  {
    id: 'file-4',
    name: 'social_media_trends.pdf',
    type: 'application/pdf',
    size: 512000,
    uploadedAt: '2024-01-12T16:45:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-5',
    name: 'hashtag_research.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 156672,
    uploadedAt: '2024-01-11T11:30:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-6',
    name: 'content_calendar.csv',
    type: 'text/csv',
    size: 8192,
    uploadedAt: '2024-01-10T13:20:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-7',
    name: 'engagement_metrics.json',
    type: 'application/json',
    size: 25600,
    uploadedAt: '2024-01-09T15:10:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-8',
    name: 'platform_specs.md',
    type: 'text/markdown',
    size: 12288,
    uploadedAt: '2024-01-08T10:45:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-9',
    name: 'audience_analysis.pdf',
    type: 'application/pdf',
    size: 341760,
    uploadedAt: '2024-01-07T14:30:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-10',
    name: 'viral_posts_examples.txt',
    type: 'text/plain',
    size: 45056,
    uploadedAt: '2024-01-06T12:15:00Z',
    promptId: 'prompt-3'
  },
  {
    id: 'file-11',
    name: 'coding_standards.pdf',
    type: 'application/pdf',
    size: 198400,
    uploadedAt: '2024-01-05T09:30:00Z',
    promptId: 'prompt-4'
  },
  {
    id: 'file-12',
    name: 'best_practices.md',
    type: 'text/markdown',
    size: 32768,
    uploadedAt: '2024-01-04T16:20:00Z',
    promptId: 'prompt-4'
  }
];

// Поддерживаемые типы файлов
const FILE_TYPE_ICONS = {
  'application/pdf': FileText,
  'text/plain': FileText,
  'text/markdown': FileText,
  'text/csv': FileText,
  'application/json': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/gif': Image,
  'video/mp4': FileVideo,
  'audio/mpeg': Music,
  'application/zip': Archive,
  'default': FileText
};

export function FilesSection() {
  // Состояние данных
  const [prompts, setPrompts] = useState<PromptWithFiles[]>(MOCK_PROMPTS);
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithFiles | null>(null);
  const [promptFiles, setPromptFiles] = useState<FileItem[]>([]);
  
  // Состояние UI
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  
  // Состояние загрузки файлов
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Загрузка файлов для выбранного промпта
  useEffect(() => {
    if (selectedPrompt) {
      const filteredFiles = files.filter(file => file.promptId === selectedPrompt.id);
      setPromptFiles(filteredFiles);
    } else {
      setPromptFiles([]);
    }
  }, [selectedPrompt, files]);

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  // Получить иконку для типа файла
  const getFileIcon = (fileType: string) => {
    const IconComponent = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.default;
    return IconComponent;
  };

  // Получить читаемое название типа файла
  const getFileTypeName = (fileType: string) => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'text/plain': 'Текст',
      'text/markdown': 'Markdown',
      'text/csv': 'CSV',
      'application/json': 'JSON',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
      'image/jpeg': 'JPEG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'video/mp4': 'MP4',
      'audio/mpeg': 'MP3',
      'application/zip': 'ZIP'
    };
    return typeMap[fileType] || 'Файл';
  };

  // Выбор промпта
  const handlePromptSelect = (prompt: PromptWithFiles) => {
    setSelectedPrompt(prompt);
  };

  // Открыть модальное окно удаления
  const handleDeleteFile = (file: FileItem) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  // Подтвердить удаление файла
  const handleConfirmDelete = async () => {
    if (!fileToDelete || !selectedPrompt) return;
    
    setLoading(true);
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Удаляем файл из списка
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete.id));
    
    // Обновляем счетчик файлов в промпте
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === selectedPrompt.id 
          ? { ...prompt, filesCount: Math.max(0, prompt.filesCount - 1) }
          : prompt
      )
    );
    
    setShowDeleteModal(false);
    setFileToDelete(null);
    setLoading(false);
  };

  // Открыть модальное окно загрузки
  const handleOpenUpload = () => {
    setUploadFiles([]);
    setUploadProgress(0);
    setShowUploadModal(true);
  };

  // Обработка выбора файлов
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setUploadFiles(selectedFiles);
  };

  // Загрузка файлов
  const handleUploadFiles = async () => {
    if (!selectedPrompt || uploadFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Имитация загрузки с прогрессом
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Создаем новые файлы
    const newFiles: FileItem[] = uploadFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      promptId: selectedPrompt.id
    }));
    
    // Добавляем файлы в список
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Обновляем счетчик файлов в промпте
    setPrompts(prevPrompts => 
      prevPrompts.map(prompt => 
        prompt.id === selectedPrompt.id 
          ? { ...prompt, filesCount: prompt.filesCount + newFiles.length }
          : prompt
      )
    );
    
    setIsUploading(false);
    setShowUploadModal(false);
    setUploadFiles([]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Управление файлами RAG</h2>
        <p className="text-gray-600">Загружайте файлы для улучшения ответов модели по конкретным промптам</p>
      </div>

      {/* 1. Таблица промптов */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Левая колонка - Таблица промптов (шире) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Промпт
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Файлы
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prompts.map((prompt) => (
                    <tr
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt)}
                      className={`cursor-pointer transition-colors ${
                        selectedPrompt?.id === prompt.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900 mb-1">{prompt.name}</div>
                        {prompt.id === 'prompt-1' && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Активный
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          prompt.filesCount === 0 
                            ? 'bg-gray-100 text-gray-800'
                            : prompt.filesCount <= 5
                            ? 'bg-green-100 text-green-800'
                            : prompt.filesCount <= 15
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prompt.filesCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Правая колонка - Таблица файлов (остальное пространство) */}
        <div className="lg:col-span-3">
          {selectedPrompt ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Файлы: {selectedPrompt.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {promptFiles.length} файлов загружено
                </p>
              </div>
              
              {promptFiles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">Файлы не найдены</p>
                  <p className="text-xs">Загрузите файлы для улучшения ответов по этому промпту</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Файл
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Размер
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {promptFiles.map((file) => {
                        const IconComponent = getFileIcon(file.type);
                        return (
                          <tr key={file.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 text-gray-400 mr-2" />
                                <div className="text-xs font-medium text-gray-900">{file.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteFile(file)}
                                className="inline-flex items-center p-1.5 border border-red-300 rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                                title="Удалить файл"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Кнопка добавления файлов */}
              <div className="px-4 py-3 border-t border-gray-200">
                <button
                  onClick={handleOpenUpload}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Добавить файлы
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите промпт</h3>
              <p className="text-sm">Нажмите на промпт слева для просмотра его файлов</p>
            </div>
          )}
        </div>
      </div>

      {/* Старая структура - удаляем */}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && fileToDelete && (
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
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Вы уверены, что хотите удалить файл <strong>{fileToDelete.name}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Это действие нельзя отменить. Файл будет удален навсегда.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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

      {/* Модальное окно загрузки файлов */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Загрузка файлов</h2>
                  <p className="text-sm text-gray-500">Промпт: {selectedPrompt?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Область загрузки */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Выберите файлы
                    </span>
                    <span className="text-gray-600"> или перетащите их сюда</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.txt,.md,.csv,.json,.docx,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Поддерживаемые форматы: PDF, TXT, MD, CSV, JSON, DOCX, XLSX, JPG, PNG, GIF, MP4, MP3, ZIP
                </p>
              </div>

              {/* Список выбранных файлов */}
              {uploadFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Выбранные файлы ({uploadFiles.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadFiles.map((file, index) => {
                      const IconComponent = getFileIcon(file.type);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-xs text-gray-500">
                                {getFileTypeName(file.type)} • {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                          {!isUploading && (
                            <button
                              onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Прогресс загрузки */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Загрузка файлов...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleUploadFiles}
                disabled={uploadFiles.length === 0 || isUploading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Загрузка...
                  </div>
                ) : (
                  `Загрузить ${uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}