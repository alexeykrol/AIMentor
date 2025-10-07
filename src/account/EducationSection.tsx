import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Play, Clock, User, Calendar, X, GraduationCap } from 'lucide-react';

// Типы данных
interface Lesson {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  author: string;
  duration: number; // в минутах
  difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
  createdAt: string;
  tags: string[];
  videoUrl: string; // URL видео
  thumbnail: string; // превью видео
  viewsCount: number;
  rating: number;
  isWatched: boolean; // просмотрен ли урок
  watchProgress: number; // прогресс просмотра в процентах
}

interface LessonCategory {
  id: string;
  name: string;
  count: number;
}

// Mock данные категорий
const MOCK_CATEGORIES: LessonCategory[] = [
  { id: 'all', name: 'Все уроки', count: 24 },
  { id: 'watched', name: 'Просмотрено', count: 5 },
  { id: 'basics', name: 'Основы ИИ', count: 8 },
  { id: 'prompts', name: 'Промпт-инжиниринг', count: 6 },
  { id: 'productivity', name: 'Продуктивность', count: 4 },
  { id: 'business', name: 'ИИ в бизнесе', count: 3 },
  { id: 'advanced', name: 'Продвинутые техники', count: 3 },
];

// Mock данные уроков
const MOCK_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Основы работы с ИИ-ассистентами',
    description: 'Изучите базовые принципы эффективного общения с ИИ',
    fullDescription: 'В этом уроке вы узнаете основные принципы работы с ИИ-ассистентами, научитесь формулировать эффективные запросы и получать качественные ответы. Рассмотрим типичные ошибки новичков и способы их избежать.',
    category: 'basics',
    author: 'AI Expert',
    duration: 15,
    difficulty: 'Начинающий',
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['основы', 'начинающим', 'эффективность'],
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 1247,
    rating: 4.8,
    isWatched: true,
    watchProgress: 100
  },
  {
    id: 'lesson-2',
    title: 'Промпт-инжиниринг для начинающих',
    description: 'Научитесь создавать эффективные промпты для любых задач',
    fullDescription: 'Глубокое погружение в искусство создания промптов. Изучите структуру эффективных запросов, техники контекстуализации и способы получения точных ответов от ИИ.',
    category: 'prompts',
    author: 'Prompt Master',
    duration: 22,
    difficulty: 'Средний',
    createdAt: '2024-01-12T14:20:00Z',
    tags: ['промпты', 'техники', 'эффективность'],
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 892,
    rating: 4.9,
    isWatched: true,
    watchProgress: 65
  },
  {
    id: 'lesson-3',
    title: 'ИИ для повышения продуктивности',
    description: 'Автоматизируйте рутинные задачи с помощью ИИ',
    fullDescription: 'Практический курс по использованию ИИ для автоматизации повседневных задач. Рассмотрим конкретные кейсы применения в работе, учебе и личной жизни.',
    category: 'productivity',
    author: 'Productivity Guru',
    duration: 18,
    difficulty: 'Средний',
    createdAt: '2024-01-10T09:15:00Z',
    tags: ['продуктивность', 'автоматизация', 'практика'],
    videoUrl: 'https://example.com/video3.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 1156,
    rating: 4.7,
    isWatched: false,
    watchProgress: 0
  },
  {
    id: 'lesson-4',
    title: 'Интеграция ИИ в бизнес-процессы',
    description: 'Внедрение ИИ-решений в корпоративную среду',
    fullDescription: 'Комплексный подход к внедрению ИИ в бизнес. От анализа потребностей до масштабирования решений. Реальные кейсы успешных внедрений.',
    category: 'business',
    author: 'Business AI',
    duration: 35,
    difficulty: 'Продвинутый',
    createdAt: '2024-01-08T16:45:00Z',
    tags: ['бизнес', 'внедрение', 'корпоративный'],
    videoUrl: 'https://example.com/video4.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 634,
    rating: 4.6,
    isWatched: false,
    watchProgress: 0
  },
  {
    id: 'lesson-5',
    title: 'Продвинутые техники работы с ИИ',
    description: 'Сложные сценарии и нестандартные подходы',
    fullDescription: 'Для опытных пользователей: сложные техники промптинга, цепочки запросов, работа с контекстом и создание собственных методологий.',
    category: 'advanced',
    author: 'AI Researcher',
    duration: 28,
    difficulty: 'Продвинутый',
    createdAt: '2024-01-06T11:30:00Z',
    tags: ['продвинутый', 'техники', 'исследования'],
    videoUrl: 'https://example.com/video5.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 445,
    rating: 4.9,
    isWatched: true,
    watchProgress: 100
  },
  {
    id: 'lesson-6',
    title: 'Этика и ответственность в ИИ',
    description: 'Этические аспекты использования искусственного интеллекта',
    fullDescription: 'Важные вопросы этики при работе с ИИ. Ответственное использование, предотвращение предвзятости, защита приватности и социальные последствия.',
    category: 'basics',
    author: 'Ethics Expert',
    duration: 20,
    difficulty: 'Начинающий',
    createdAt: '2024-01-04T13:20:00Z',
    tags: ['этика', 'ответственность', 'общество'],
    videoUrl: 'https://example.com/video6.mp4',
    thumbnail: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewsCount: 789,
    rating: 4.5,
    isWatched: false,
    watchProgress: 0
  }
];

export function EducationSection() {
  // Состояние данных
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [categories, setCategories] = useState<LessonCategory[]>(MOCK_CATEGORIES);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(MOCK_LESSONS);
  
  // Состояние UI
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Фильтрация уроков
  useEffect(() => {
    let filtered = lessons;
    
    // Фильтр по категории
    if (selectedCategory === 'watched') {
      filtered = filtered.filter(lesson => lesson.isWatched);
    } else if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredLessons(filtered);
  }, [lessons, selectedCategory, searchQuery]);

  // Форматирование длительности
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Получить цвет для уровня сложности
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Начинающий': return 'bg-green-100 text-green-800';
      case 'Средний': return 'bg-yellow-100 text-yellow-800';
      case 'Продвинутый': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Открыть видео урок
  const handleWatchLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowVideoModal(true);
    
    // Отмечаем урок как просмотренный
    if (!lesson.isWatched) {
      setLessons(prevLessons => 
        prevLessons.map(l => 
          l.id === lesson.id 
            ? { ...l, isWatched: true, watchProgress: 100 }
            : l
        )
      );
    }
  };

  // Компонент карточки урока
  const LessonCard = ({ lesson }: { lesson: Lesson }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Превью видео */}
      <div className="relative w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden group">
        <img 
          src={lesson.thumbnail} 
          alt={lesson.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay с кнопкой воспроизведения */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </div>
        </div>
        
        {/* Прогресс просмотра */}
        {lesson.watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${lesson.watchProgress}%` }}
            />
          </div>
        )}
        
        {/* Длительность */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {formatDuration(lesson.duration)}
        </div>
        
        {/* Статус просмотра */}
        {lesson.isWatched && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            ✓ Просмотрено
          </div>
        )}
      </div>

      {/* Заголовок и рейтинг */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
          {lesson.title}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500 flex-shrink-0">
          <div className="text-yellow-400">★</div>
          <span>{lesson.rating}</span>
        </div>
      </div>

      {/* Уровень сложности */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
          {lesson.difficulty}
        </span>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {lesson.description}
      </p>

      {/* Теги */}
      <div className="flex flex-wrap gap-2 mb-4">
        {lesson.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Автор и просмотры */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <User className="w-3 h-3 mr-1" />
        <span className="mr-4">{lesson.author}</span>
        <Eye className="w-3 h-3 mr-1" />
        <span>{lesson.viewsCount.toLocaleString()} просмотров</span>
      </div>

      {/* Кнопка просмотра */}
      <div className="flex justify-center">
        <button
          onClick={() => handleWatchLesson(lesson)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          {lesson.isWatched ? 'Пересмотреть' : 'Смотреть'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Обучение и развитие</h2>
        <p className="text-gray-600">Видео-уроки и курсы по эффективной работе с ИИ</p>
      </div>

      {/* Поиск и категории */}
      <div className="space-y-4">
        {/* Поиск */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск уроков..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Категории в виде кнопок */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Список уроков */}
      <div>
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Уроки не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно видео */}
      {showVideoModal && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Заголовок модального окна */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(selectedLesson.duration)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>{selectedLesson.author}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(selectedLesson.difficulty)}`}>
                      {selectedLesson.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое модального окна */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Левая колонка - Видео плеер */}
                <div className="lg:col-span-2">
                  <div className="w-full h-64 lg:h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                      <p className="text-lg font-medium mb-2">Видео плеер</p>
                      <p className="text-sm opacity-70">Здесь будет встроенный видео плеер</p>
                      <p className="text-xs opacity-50 mt-2">URL: {selectedLesson.videoUrl}</p>
                    </div>
                  </div>
                  
                  {/* Описание урока */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">О чем этот урок</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedLesson.fullDescription}</p>
                  </div>
                </div>

                {/* Правая колонка - Информация */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация об уроке</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Длительность</div>
                          <div className="text-sm text-gray-600">{formatDuration(selectedLesson.duration)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Уровень</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(selectedLesson.difficulty)}`}>
                            {selectedLesson.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Автор</div>
                          <div className="text-sm text-gray-600">{selectedLesson.author}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Просмотры</div>
                          <div className="text-sm text-gray-600">{selectedLesson.viewsCount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Дата создания</div>
                          <div className="text-sm text-gray-600">{formatDate(selectedLesson.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Теги */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Теги</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Прогресс */}
                  {selectedLesson.watchProgress > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Прогресс</h3>
                      <div className="bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedLesson.watchProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedLesson.watchProgress === 100 ? 'Урок завершен' : `Просмотрено ${selectedLesson.watchProgress}%`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}