# UX Сценарии и Структура Данных - AI Chat Assistant

## 📋 Обзор системы

AI Chat Assistant работает с **тремя основными состояниями пользователя**, каждое из которых определяет интерфейс и доступные функции.

---

## 🎯 Состояния пользователя

### 1. **НЕ ПРОАНАЛИЗИРОВАН** (`user_status: 'not_analyzed'`)
- Пользователь новый или не проходил анализ
- Доступен обычный чат + возможность активации персонального режима

### 2. **В ПРОЦЕССЕ АНАЛИЗА** (`user_status: 'analyzing'`)
- Пользователь активировал персональный режим
- Система собирает данные (10 вопросов с прогресс-баром)

### 3. **ПРОАНАЛИЗИРОВАН** (`user_status: 'analyzed'`)
- Анализ завершен, персональные вопросы сгенерированы
- Доступ к индивидуальным рекомендациям

---

## 🖥️ Интерфейсы по состояниям

### **Состояние 1: НЕ ПРОАНАЛИЗИРОВАН**

#### Элементы интерфейса:
- **8 предустановленных кнопок** с популярными вопросами
- **Кнопка "✨ Примеры крутых вопросов"** (синяя)
- **Кнопка "🎯 Включить мой вопрос"** (синяя)
- **Информационный блок** с описанием работы системы

#### Поведение кнопок:
- **Предустановленные кнопки** → отправляют вопрос в чат
- **"Примеры крутых вопросов"** → открывает модальное окно с примерами
- **"Включить мой вопрос"** → открывает модальное окно активации персонального режима

---

### **Состояние 2: В ПРОЦЕССЕ АНАЛИЗА**

#### Элементы интерфейса:
- **8 предустановленных кнопок** (те же)
- **Кнопка "✨ Примеры крутых вопросов"** (синяя)
- **Кнопка "🎯 Выключить мой вопрос"** (темно-синяя, активная)
- **Прогресс-бар анализа** с сегментированной шкалой (10 сегментов)
- **Динамическое сообщение** о прогрессе

#### Поведение:
- **Счетчик вопросов** увеличивается с каждым сообщением
- **Прогресс-бар** заполняется градиентом (синий → фиолетовый)
- **Сообщения прогресса** меняются в зависимости от количества вопросов:
  - 6+ вопросов: "Режим 'Мой вопрос' активен, вам осталось задать X вопросов"
  - 3-5 вопросов: "Отлично! Еще X вопросов и мы составим ваш профиль"
  - 2 вопроса: "Это круто! Нужна еще пара вопросов"
  - 1 вопрос: "Почти готово! Последний вопрос!"
- **При достижении 10 вопросов** → переход в состояние "Анализ завершен"

---

### **Состояние 3A: ПРОАНАЛИЗИРОВАН + Анализ только что завершен**

#### Элементы интерфейса:
- **Зеленое уведомление**: "🎉 Анализ завершен! Ваши индивидуальные вопросы готовы!"
- **Центральная карточка** с поздравлением и описанием
- **Кнопка "Посмотреть ваши вопросы"** (синяя, крупная)

#### Поведение:
- **Чат очищается** при завершении анализа
- **Кнопка** открывает модальное окно с персональными вопросами

---

### **Состояние 3B: ПРОАНАЛИЗИРОВАН + Новый чат**

#### Элементы интерфейса:
- **8 предустановленных кнопок** (те же)
- **Кнопка "✨ Примеры крутых вопросов"** (синяя)
- **Кнопка "🎯 Мои вопросы"** (зеленая)

#### Поведение:
- **"Мои вопросы"** → открывает модальное окно с персональными рекомендациями
- **Обычный чат** работает как в состоянии 1

---

## 🔄 Переходы между состояниями

```
НЕ ПРОАНАЛИЗИРОВАН 
    ↓ (нажатие "Включить мой вопрос")
В ПРОЦЕССЕ АНАЛИЗА 
    ↓ (10 вопросов задано)
ПРОАНАЛИЗИРОВАН (анализ завершен)
    ↓ (нажатие "Новый чат")
ПРОАНАЛИЗИРОВАН (новый чат)
```

### Триггеры переходов:
1. **НЕ ПРОАНАЛИЗИРОВАН → В ПРОЦЕССЕ АНАЛИЗА**
   - Нажатие "Включить мой вопрос" в модальном окне
   - `user_status = 'analyzing'`, `questions_count = 0`

2. **В ПРОЦЕССЕ АНАЛИЗА → ПРОАНАЛИЗИРОВАН**
   - Достижение 10 вопросов
   - `user_status = 'analyzed'`, генерация персональных вопросов

3. **ПРОАНАЛИЗИРОВАН (завершен) → ПРОАНАЛИЗИРОВАН (новый чат)**
   - Нажатие "Новый чат"
   - Очистка текущего чата, сохранение статуса

---

## 📱 Модальные окна

### **1. Модальное окно "Примеры крутых вопросов"**
- **Заголовок**: "Примеры крутых вопросов"
- **Иконка**: Lightbulb (💡)
- **Структура**: Левая панель (категории) + правая панель (содержимое)
- **Категории**: Креативные, философские, альтернативная история, и т.д.
- **Кнопка**: "Спросить" (заполняет поле ввода, не отправляет)

### **2. Модальное окно "Включить мой вопрос"**
- **Заголовок**: "Включить мой вопрос"
- **Иконка**: Target (🎯)
- **Содержимое**: Описание персонального режима
- **Кнопка**: "Включить" (активирует режим анализа)

### **3. Модальное окно "Ваши персональные вопросы"**
- **Заголовок**: "Ваши персональные вопросы"
- **Иконка**: Target (🎯)
- **Структура**: Аналогична примерам, но с персональными категориями
- **Категории**: Развитие карьеры, личностный рост, стратегия обучения, и т.д.
- **Кнопка**: "Спросить" (заполняет поле ввода)

---

## 💬 Чат интерфейс

### **Компоненты чата:**
- **Область сообщений** с автоскроллом
- **Поле ввода** с счетчиком символов (лимит 5000)
- **Кнопка отправки** (активна при наличии текста)
- **Индикатор печати** при ответе ИИ

### **Типы сообщений:**
- **Пользователь**: Синий фон, справа, иконка User
- **ИИ**: Серый фон, слева, иконка Bot
- **Системные**: Уведомления о состоянии

### **Функции сообщений:**
- **Копирование** (только для сообщений ИИ)
- **Временные метки** (относительное время)
- **Адаптивность** (мобильная версия)

---

## 🎨 UI Элементы

### **Кнопки:**
- **Предустановленные вопросы**: Серый фон, hover эффект
- **Примеры**: Синий фон (`bg-blue-50`, `border-blue-200`)
- **Включить мой вопрос**: Синий фон (неактивный) / темно-синий (активный)
- **Мои вопросы**: Зеленый фон (`bg-green-50`, `border-green-200`)

### **Прогресс-бар:**
- **10 сегментов** с градиентным заполнением
- **Цвета**: Синий → фиолетовый (HSL переходы)
- **Анимации**: Плавное заполнение с задержкой

### **Уведомления:**
- **Информационные**: Синий фон (`bg-blue-50`)
- **Прогресс**: Градиент синий-индиго
- **Завершение**: Зеленый фон (`bg-green-50`)

---

## 🗄️ Структура базы данных

### **Таблица: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Статус анализа пользователя
  analysis_status VARCHAR(20) DEFAULT 'not_analyzed' 
    CHECK (analysis_status IN ('not_analyzed', 'analyzing', 'analyzed')),
  
  -- Счетчик вопросов для анализа
  analysis_questions_count INTEGER DEFAULT 0,
  
  -- Дата завершения анализа
  analysis_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Метаданные анализа
  analysis_metadata JSONB DEFAULT '{}'::jsonb
);
```

### **Таблица: chats**
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Тип чата
  chat_type VARCHAR(20) DEFAULT 'regular' 
    CHECK (chat_type IN ('regular', 'analysis', 'personal')),
  
  -- Статус чата
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'archived', 'deleted')),
  
  -- Метаданные чата
  metadata JSONB DEFAULT '{}'::jsonb
);
```

### **Таблица: messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Метаданные сообщения
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Для анализа: помечаем сообщения, которые участвуют в анализе
  is_analysis_message BOOLEAN DEFAULT FALSE,
  analysis_weight DECIMAL(3,2) DEFAULT 1.0
);
```

### **Таблица: personal_questions**
```sql
CREATE TABLE personal_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Категория вопроса
  category VARCHAR(100) NOT NULL,
  category_title VARCHAR(200) NOT NULL,
  
  -- Содержимое вопроса
  question_content TEXT NOT NULL,
  
  -- Приоритет показа (1 = высший)
  priority INTEGER DEFAULT 5,
  
  -- Статус вопроса
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'used', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Метаданные для алгоритма генерации
  generation_metadata JSONB DEFAULT '{}'::jsonb
);
```

### **Таблица: user_analysis_data**
```sql
CREATE TABLE user_analysis_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Данные анализа
  analysis_type VARCHAR(50) NOT NULL, -- 'interests', 'personality', 'goals', etc.
  analysis_data JSONB NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Таблица: question_templates**
```sql
CREATE TABLE question_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Шаблон вопроса
  category VARCHAR(100) NOT NULL,
  template_content TEXT NOT NULL,
  
  -- Условия применения
  conditions JSONB DEFAULT '{}'::jsonb, -- когда использовать этот шаблон
  
  -- Приоритет шаблона
  priority INTEGER DEFAULT 5,
  
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 RLS Политики

### **Политики безопасности:**
```sql
-- Users: пользователи видят только свои данные
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Chats: пользователи видят только свои чаты
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own chats" ON chats FOR ALL TO authenticated USING (user_id = auth.uid());

-- Messages: пользователи видят только сообщения своих чатов
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON messages FOR ALL TO authenticated USING (user_id = auth.uid());

-- Personal Questions: только свои персональные вопросы
ALTER TABLE personal_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own questions" ON personal_questions FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Analysis Data: только свои данные анализа
ALTER TABLE user_analysis_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analysis" ON user_analysis_data FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Question Templates: доступны всем для чтения
ALTER TABLE question_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are readable by all" ON question_templates FOR SELECT TO authenticated USING (true);
```

---

## 📊 Индексы для производительности

```sql
-- Основные индексы
CREATE INDEX idx_users_analysis_status ON users(analysis_status);
CREATE INDEX idx_chats_user_id_created ON chats(user_id, created_at DESC);
CREATE INDEX idx_messages_chat_id_created ON messages(chat_id, created_at);
CREATE INDEX idx_messages_analysis ON messages(user_id, is_analysis_message) WHERE is_analysis_message = true;
CREATE INDEX idx_personal_questions_user_category ON personal_questions(user_id, category, priority);
CREATE INDEX idx_analysis_data_user_type ON user_analysis_data(user_id, analysis_type);
```

---

## 🔄 API Endpoints (планируемые)

### **Пользователь:**
- `GET /api/user/profile` - получить профиль и статус анализа
- `PUT /api/user/analysis-status` - обновить статус анализа
- `POST /api/user/start-analysis` - начать персональный анализ

### **Чаты:**
- `GET /api/chats` - список чатов пользователя
- `POST /api/chats` - создать новый чат
- `GET /api/chats/:id/messages` - сообщения чата
- `POST /api/chats/:id/messages` - отправить сообщение

### **Персональные вопросы:**
- `GET /api/personal-questions` - получить персональные вопросы
- `POST /api/generate-personal-questions` - сгенерировать вопросы после анализа

### **Анализ:**
- `POST /api/analysis/process` - обработать данные для анализа
- `GET /api/analysis/status` - статус анализа пользователя

---

## 🎯 Алгоритм генерации персональных вопросов

### **Этапы анализа:**
1. **Сбор данных** (10 вопросов в персональном режиме)
2. **Анализ интересов** (ключевые слова, темы)
3. **Определение личности** (стиль общения, предпочтения)
4. **Выявление целей** (что хочет узнать/достичь)
5. **Генерация вопросов** (на основе шаблонов + ИИ)

### **Категории персональных вопросов:**
- **Развитие карьеры** (на основе профессиональных интересов)
- **Личностный рост** (исходя из запросов о саморазвитии)
- **Стратегия обучения** (методы изучения новой информации)
- **Баланс жизни и работы** (приоритеты и ценности)
- **Планирование будущего** (долгосрочные цели)

---

## 📱 Адаптивность и UX

### **Брейкпоинты:**
- **Mobile**: < 768px (коллапсированный сайдбар, упрощенный интерфейс)
- **Tablet**: 768px - 1024px (адаптивная сетка)
- **Desktop**: > 1024px (полный интерфейс)

### **Анимации:**
- **Прогресс-бар**: Плавное заполнение с градиентом
- **Модальные окна**: Slide-in анимации
- **Кнопки**: Hover эффекты и transitions
- **Сообщения**: Появление с fade-in

### **Доступность:**
- **Клавиатурная навигация** для всех элементов
- **ARIA-labels** для скрин-ридеров
- **Контрастность** соответствует WCAG 2.1
- **Фокус-индикаторы** для интерактивных элементов

---

## 🚀 Техническая реализация

### **Frontend стек:**
- **React 18** + TypeScript
- **Tailwind CSS** для стилизации
- **Supabase** для авторизации и данных
- **date-fns** для работы с датами
- **Lucide React** для иконок

### **Состояние приложения:**
- **Локальное состояние** для UI (модальные окна, формы)
- **Supabase Realtime** для синхронизации данных
- **Кэширование** персональных вопросов в localStorage

### **Оптимизация:**
- **Lazy loading** для модальных окон
- **Виртуализация** для длинных списков чатов
- **Debouncing** для поиска и автосохранения
- **Service Worker** для офлайн режима (будущее)

---

## 📈 Метрики и аналитика

### **Ключевые метрики:**
- **Конверсия в анализ** (% пользователей, активировавших персональный режим)
- **Завершение анализа** (% пользователей, дошедших до 10 вопросов)
- **Использование персональных вопросов** (клики по "Мои вопросы")
- **Время в чате** и **количество сообщений**
- **Возвращаемость** пользователей

### **A/B тесты:**
- **Тексты кнопок** ("Включить мой вопрос" vs альтернативы)
- **Количество вопросов для анализа** (5 vs 10 vs 15)
- **Дизайн прогресс-бара** (сегментированный vs обычный)
- **Момент показа персональных вопросов**

---

## 🔮 Будущие возможности

### **Расширения функциональности:**
- **Голосовой ввод** и **синтез речи**
- **Загрузка файлов** (документы, изображения)
- **Интеграция с календарем** для планирования
- **Экспорт чатов** в различные форматы
- **Темная тема** и **кастомизация интерфейса**

### **ИИ улучшения:**
- **Контекстная память** между чатами
- **Эмоциональный анализ** сообщений
- **Предиктивные вопросы** на основе поведения
- **Мультимодальность** (текст + изображения + аудио)

### **Социальные функции:**
- **Шаринг интересных диалогов**
- **Коллаборативные чаты**
- **Рейтинг качества ответов**
- **Сообщество пользователей**

---

*Документация актуальна на момент создания. При изменении функциональности требует обновления.*