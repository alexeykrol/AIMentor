import { useState } from 'react';

export function usePersonalization() {
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [personalQuestionMode, setPersonalQuestionMode] = useState(false);
  const [targetQuestions, setTargetQuestions] = useState(10);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Handle personal question mode activation
  const togglePersonalMode = () => {
    if (personalQuestionMode) {
      // Выключаем режим
      setPersonalQuestionMode(false);
    } else {
      // Включаем режим
      setPersonalQuestionMode(true);
      setTargetQuestions(10);
    }
  };

  // Calculate progress for personal question mode
  const getPersonalModeProgress = () => {
    if (!personalQuestionMode || analysisCompleted) return { percentage: 0, remaining: 0, message: '' };
    
    const remaining = Math.max(0, targetQuestions - totalQuestionCount);
    const percentage = Math.min(100, (totalQuestionCount / targetQuestions) * 100);
    
    let message = '';
    if (remaining > 5) {
      message = `Режим "Мой вопрос" активен, вам осталось задать ${remaining} вопросов`;
    } else if (remaining > 2) {
      message = `Отлично! Еще ${remaining} вопросов и мы составим ваш профиль`;
    } else if (remaining === 2) {
      message = `Это круто! Нужна еще пара вопросов`;
    } else if (remaining > 0) {
      message = `Почти готово! Последний ${remaining === 1 ? 'вопрос' : 'вопроса'}!`;
    } else {
      message = '🎉 Анализ завершен! Ваши индивидуальные вопросы готовы!';
    }
    
    return { percentage, remaining, message };
  };

  // Handle question increment with analysis completion check
  const incrementQuestionCount = () => {
    console.log('=== PERSONALIZATION INCREMENT DEBUG ===');
    console.log('Current totalQuestionCount:', totalQuestionCount);
    console.log('Current targetQuestions:', targetQuestions);
    console.log('Current personalQuestionMode:', personalQuestionMode);
    console.log('Current analysisCompleted:', analysisCompleted);
    
    const newCount = totalQuestionCount + 1;
    setTotalQuestionCount(newCount);
    console.log('New count will be:', newCount);
    
    // Complete analysis when reaching target in personal mode (only if not already completed)
    if (personalQuestionMode && !analysisCompleted && newCount >= targetQuestions) {
      setAnalysisCompleted(true);
      return true; // Signal that analysis is completed
    }
    
    return false;
  };

  return {
    totalQuestionCount,
    personalQuestionMode,
    targetQuestions,
    analysisCompleted,
    togglePersonalMode,
    getPersonalModeProgress,
    incrementQuestionCount,
  };
}