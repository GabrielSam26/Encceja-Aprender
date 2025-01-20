import React from 'react';
import { Settings, Sun, Moon, Type } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface StudySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudySettings: React.FC<StudySettingsProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Settings className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">Configurações</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center dark:text-white">
            {theme === 'light' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
            Tema
          </span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {theme === 'light' ? 'Escuro' : 'Claro'}
          </button>
        </div>

        <div className="space-y-2">
          <span className="flex items-center dark:text-white">
            <Type className="h-5 w-5 mr-2" />
            Tamanho da Fonte
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'large', 'larger'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-2 rounded-lg ${
                  fontSize === size
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Maior'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};