import React from 'react';

interface ProgressBarProps {
  totalQuestions: number;
  targetQuestions: number;
  message: string;
}

export function ProgressBar({ totalQuestions, targetQuestions, message }: ProgressBarProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0 w-full">
      <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2 sm:p-3 lg:p-4">
          <p className="text-xs text-center mb-2 text-gray-600">
            DEBUG: Вопросов задано: {totalQuestions} / Цель: {targetQuestions}
          </p>
          <p className="text-xs sm:text-sm text-blue-800 text-center mb-3 font-medium">
            {message}
          </p>
          <div className="w-full bg-blue-100 rounded-full h-2 sm:h-3">
            <div className="flex h-2 sm:h-3 rounded-full overflow-hidden bg-gray-200">
              {Array.from({ length: 10 }, (_, index) => {
                const progressSegments = Math.min(10, totalQuestions); // Direct count, max 10
                const isActive = index < progressSegments;
                const intensity = isActive ? Math.max(0.3, 1 - (index / 10) * 0.7) : 0;
                const hue = 220 - (index * 2); // Более синий слева, чуть фиолетовый справа
                const saturation = isActive ? 85 + (intensity * 15) : 20;
                const lightness = isActive ? 45 + ((1 - intensity) * 25) : 85;
                
                return (
                  <div
                    key={index}
                    className={`flex-1 transition-all duration-500 ease-out ${index === 0 ? 'rounded-l-full' : ''} ${index === 9 ? 'rounded-r-full' : ''} ${index > 0 ? 'ml-px' : ''}`}
                    style={{
                      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                      boxShadow: isActive ? `0 0 4px hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)` : 'none'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}