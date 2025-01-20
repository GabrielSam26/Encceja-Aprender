import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface Step {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const OnboardingTour: React.FC = () => {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const steps: Step[] = [
    {
      target: 'nav',
      title: 'Bem-vindo ao ENCCEJA Aprender! 👋',
      content: 'Este é seu guia de estudos personalizado para o ENCCEJA. Vamos te mostrar como aproveitar ao máximo a plataforma.',
      position: 'bottom'
    },
    {
      target: '[data-tour="level-selector"]',
      title: 'Escolha seu Nível',
      content: 'Selecione entre Ensino Fundamental ou Médio para ver o conteúdo adequado ao seu objetivo.',
      position: 'bottom'
    },
    {
      target: '[data-tour="subject-grid"]',
      title: 'Matérias Disponíveis',
      content: 'Aqui você encontra todas as matérias organizadas por área de conhecimento.',
      position: 'left'
    },
    {
      target: '[data-tour="study-tools"]',
      title: 'Ferramentas de Estudo',
      content: 'Use a calculadora, timer pomodoro, flashcards e outras ferramentas para otimizar seus estudos.',
      position: 'left'
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  useEffect(() => {
    if (showTour && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target);
      if (element instanceof HTMLElement) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, showTour]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  if (!showTour) {
    return (
      <button
        onClick={() => setShowTour(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        title="Ajuda"
      >
        <HelpCircle className="h-6 w-6" />
      </button>
    );
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[60]" />

      {/* Highlight current element */}
      {highlightedElement && (
        <div
          className="fixed z-[61] pointer-events-none"
          style={{
            top: highlightedElement.offsetTop - 4,
            left: highlightedElement.offsetLeft - 4,
            width: highlightedElement.offsetWidth + 8,
            height: highlightedElement.offsetHeight + 8,
            border: '2px solid #4F46E5',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Tour dialog */}
      <div className="fixed z-[62] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={completeTour}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {currentStepData.content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-indigo-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Concluir
                  <Check className="h-5 w-5 ml-1" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};