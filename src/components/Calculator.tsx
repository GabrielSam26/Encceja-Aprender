import React, { useState } from 'react';
import { Calculator as CalculatorIcon, X } from 'lucide-react';
import { create, all } from 'mathjs';

const math = create(all);

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const calculateResult = () => {
    try {
      const evaluated = math.evaluate(expression);
      setResult(math.format(evaluated, { precision: 14 }));
    } catch (error) {
      setResult('Erro');
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      calculateResult();
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else {
      setExpression(prev => prev + value);
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['(', ')', '^', 'C']
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <CalculatorIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">Calculadora</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className="w-full p-2 text-right border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="0"
        />
        {result && (
          <div className="text-right mt-2 text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            = {result}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.map((row, i) => (
          row.map((btn, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleButtonClick(btn)}
              className="p-2 text-center bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
            >
              {btn}
            </button>
          ))
        ))}
      </div>
    </div>
  );
};