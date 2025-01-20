import React, { useState, useEffect } from 'react';
import { Timer, Pause, Play, RotateCcw } from 'lucide-react';

interface StudyTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ isOpen, onClose }) => {
  const [time, setTime] = useState(25 * 60); // 25 minutos em segundos
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      if (mode === 'study') {
        setMode('break');
        setTime(5 * 60); // 5 minutos de pausa
      } else {
        setMode('study');
        setTime(25 * 60); // 25 minutos de estudo
      }
      // Notificação sonora
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();
    }

    return () => clearInterval(interval);
  }, [isActive, time, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Timer className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">Timer Pomodoro</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ×
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {mode === 'study' ? 'Tempo de Estudo' : 'Tempo de Pausa'}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};