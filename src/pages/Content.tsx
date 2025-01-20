import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateSubjectContent } from '../services/gemini';
import {
  ArrowLeft,
  Calculator,
  Settings,
  CreditCard,
  Timer,
  Brain,
  MessageCircle,
} from 'lucide-react';
import { Calculator as CalculatorComponent } from '../components/Calculator';
import { StudySettings } from '../components/StudySettings';
import { FlashCards } from '../components/FlashCards';
import { StudyNotes } from '../components/StudyNotes';
import { StudyTimer } from '../components/StudyTimer';
import { MindMap } from '../components/MindMap';
import { ExerciseSystem } from '../components/ExerciseSystem';
import { ChatBox } from '../components/ChatBox';
import { getTopicImages } from '../services/pexels';
import { MathVisualization } from '../components/MathVisualization';



interface Image {
  url: string;
  description: string;
  credit: {
    name: string;
    link: string;
  };
}

const Content = () => {
  const { level, subject, topic } = useParams<{ level: string; subject: string; topic: string }>();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Image[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showMindMap, setShowMindMap] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showExercises, setShowExercises] = useState(false);

  useEffect(() => {
    if (subject && topic) {
      setIsLoading(true);
      generateSubjectContent(subject, decodeURIComponent(topic))
        .then((content) => {
          setContent(content);
        })
        .catch((error) => {
          console.error('Erro ao gerar conteúdo:', error);
          setContent('Erro ao carregar o conteúdo. Por favor, tente novamente.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [subject, topic]);

  useEffect(() => {
    if (window.MathJax && content) {
      window.MathJax.typesetPromise?.();
    }
  }, [content]);

  const formatMathExpression = (text: string) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '@@$1@@');

    text = text
    .replace(/\\sqrt/g, '√')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\infty/g, '∞')
    .replace(/\\sum/g, '∑')
    .replace(/\\prod/g, '∏')
    .replace(/\\int/g, '∫')
    .replace(/\\partial/g, '∂')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈');

    text = text.replace(/@@(.*?)@@/g, '<strong>$1</strong>');

    return text;
  };

  const goBack = () => {
    window.history.back();
  };

  const renderContent = (section: string) => {
    // Verifica se é uma seção de visualização
    if (section.includes('[VISUALIZATION]')) {
      try {
        const match = section.match(/\[VISUALIZATION\]([\s\S]*?)\[\/VISUALIZATION\]/);
        if (match) {
          const config = JSON.parse(match[1]);
          return (
            <MathVisualization
              type={config.type}
              config={config.config}
              width={600}
              height={400}
            />
          );
        }
      } catch (error) {
        console.error('Erro ao processar visualização:', error);
      }
    }

    if (section.startsWith('**')) {
      const [title, ...contentLines] = section.replace(/\*\*/g, '').split('\n');
      const content = contentLines.join('\n');

      return (
        <div className="mb-12">
          <h2 className="flex items-center text-2xl font-bold text-indigo-900 dark:text-indigo-400 mb-6">
            <span className="mr-3">{title.split(' ')[0]}</span>
            {title.split(' ').slice(1).join(' ')}
          </h2>
          <div className="pl-4 space-y-4">
            {content.split('•').map((item, i) => {
              if (!item.trim()) return null;
              const formattedItem = formatMathExpression(item.trim());

              return (
                <div key={i} className="flex items-start group">
                  <span className="text-indigo-500 mr-3 transform group-hover:scale-110 transition-transform">•</span>
                  <p
                    className="mt-0 font-medium text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: formattedItem }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (section.startsWith('[')) {
      const [title, ...contentLines] = section.split('\n');
      const content = contentLines.join('\n');

      return (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl mb-8 transform transition-all duration-300 hover:scale-[1.02]">
          <h3 className="font-bold text-xl text-indigo-900 dark:text-indigo-400 mb-4">{title}</h3>
          <div className="pl-4 space-y-3">
            {content.split('•').map((line, i) => {
              if (!line.trim()) return null;
              const formattedLine = formatMathExpression(line.trim());

              return (
                <div key={i} className="flex items-start">
                  <span className="text-indigo-500 mr-3">•</span>
                  <p
                    className="mt-0 text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (section.trim()) {
      const formattedText = formatMathExpression(section);
      return (
        <p
          className="mb-6 text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    }

    return null;
  };

  const tools = [
    { icon: Brain, title: 'Exercícios', action: () => setShowExercises(true) },
    { icon: CreditCard, title: 'Flash Cards', action: () => setShowFlashCards(true) },
    { icon: Timer, title: 'Timer', action: () => setShowTimer(true) },
    { icon: Calculator, title: 'Calculadora', action: () => setShowCalculator(true) },
    { icon: Settings, title: 'Opções', action: () => setShowSettings(true) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={goBack}
          className="flex items-center text-indigo-600 dark:text-indigo-400 mb-8 hover:text-indigo-700 dark:hover:text-indigo-300 transition group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar para matérias</span>
        </button>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-100 dark:border-gray-800 z-50">
      <div className="flex justify-between items-center px-4 py-3">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className="group flex flex-col items-center min-w-[4rem] relative"
          >
            <div className="relative">
              <tool.icon className="h-6 w-6 text-gray-500 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400 transition-colors duration-200" />
              
              {/* Indicador de ativo (opcional) */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            
            <span className="text-xs font-medium mt-1.5 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400 transition-colors duration-200">
              {tool.title}
            </span>
            
            {/* Efeito hover */}
            <div className="absolute -top-8 scale-0 group-hover:scale-100 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded-md transition-transform duration-200">
              {tool.title}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
            </div>
          </button>
        ))}
      </div>
    </div>

        {/* Desktop Floating Action Buttons */}
        <div className="hidden md:flex fixed bottom-8 right-8 flex-col space-y-4">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={tool.action}
              className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110"
              title={tool.title}
            >
              <tool.icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Gerando conteúdo personalizado...
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transition-all duration-300 mb-24 md:mb-0">
            <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <span className="text-3xl">
                  {subject?.includes("Matemática")
                    ? "📐"
                    : subject?.includes("Português") || subject?.includes("Linguagens")
                    ? "📚"
                    : subject?.includes("História") || subject?.includes("Humanas")
                    ? "🌎"
                    : "🔬"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {decodeURIComponent(topic)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{subject}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              {content.split("\n\n").map((section, index) => (
                <React.Fragment key={index}>{renderContent(section)}</React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Modals and Components */}
        <ExerciseSystem
          isOpen={showExercises}
          onClose={() => setShowExercises(false)}
          currentSubject={subject}
          currentTopic={topic ? decodeURIComponent(topic) : undefined}
        />

        <MindMap
          isOpen={showMindMap}
          onClose={() => setShowMindMap(false)}
          currentSubject={subject}
          currentTopic={topic ? decodeURIComponent(topic) : undefined}
        />

        <CalculatorComponent
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />

        <StudySettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <FlashCards
          isOpen={showFlashCards}
          onClose={() => setShowFlashCards(false)}
          currentSubject={subject}
          currentTopic={topic ? decodeURIComponent(topic) : undefined}
        />

        <StudyNotes isOpen={showNotes} onClose={() => setShowNotes(false)} />

        <StudyTimer isOpen={showTimer} onClose={() => setShowTimer(false)} />

        <ChatBox
          isOpen={showChatBox}
          onClose={() => setShowChatBox(false)}
          currentSubject={subject}
          currentTopic={topic ? decodeURIComponent(topic) : undefined}
        />
      </div>
    </div>
  );
};

export default Content;
