import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Brain,
  Loader2,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { generateExercises, generatePerformanceReport } from '../services/gemini';

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExerciseSystemProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject?: string;
  currentTopic?: string;
}

export const ExerciseSystem: React.FC<ExerciseSystemProps> = ({
  isOpen,
  onClose,
  currentSubject,
  currentTopic
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && currentSubject && currentTopic) {
      generateNewExercises();
    }
  }, [isOpen, currentSubject, currentTopic]);

  const generateNewExercises = async () => {
    if (!currentSubject || !currentTopic) return;

    setIsLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    setCurrentExercise(0);
    setAnsweredQuestions(new Set());

    try {
      const newExercises = await generateExercises(currentSubject, currentTopic);
      setExercises(newExercises);
    } catch (error) {
      console.error('Erro ao gerar exercícios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (exerciseId: string, answerIndex: number) => {
    // Prevent selecting if already answered
    if (answeredQuestions.has(exerciseId)) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [exerciseId]: answerIndex
    }));

    // Mark question as answered
    setAnsweredQuestions(prev => new Set([...prev, exerciseId]));
  };

  const getScore = () => {
    let correct = 0;
    exercises.forEach(exercise => {
      if (selectedAnswers[exercise.id] === exercise.correctAnswer) {
        correct++;
      }
    });
    return (correct / exercises.length) * 100;
  };

  const generateReport = async () => {
    if (!currentSubject || !currentTopic) return;

    setIsLoading(true);
    try {
      const exerciseResults = exercises.map(exercise => ({
        topic: exercise.question,
        correct: selectedAnswers[exercise.id] === exercise.correctAnswer
      }));

      const performanceReport = await generatePerformanceReport(
        currentSubject,
        currentTopic,
        exerciseResults
      );
      setReport(performanceReport);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    } else {
      setShowResults(true);
      generateReport();
    }
  };

  const isAnswerCorrect = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise && selectedAnswers[exerciseId] === exercise.correctAnswer;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Exercícios Personalizados
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={generateNewExercises}
              className="flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Novos Exercícios
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              {showResults ? 'Gerando relatório de desempenho...' : 'Gerando exercícios personalizados...'}
            </p>
          </div>
        ) : showResults ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <BarChart3 className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Seu Desempenho: {getScore().toFixed(1)}%
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Você acertou {Object.values(selectedAnswers).filter((answer, index) =>
                  answer === exercises[index].correctAnswer
                ).length} de {exercises.length} questões
              </p>
            </div>

            <div className="prose prose-indigo dark:prose-invert max-w-none mb-8">
              <h4 className="text-xl font-semibold mb-4">Análise de Desempenho</h4>
              {report.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Revisão das Questões
              </h4>
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {selectedAnswers[exercise.id] === exercise.correctAnswer ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        {exercise.question}
                      </p>
                      <div className="space-y-2 mb-4">
                        {exercise.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg ${
                              optionIndex === exercise.correctAnswer
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : optionIndex === selectedAnswers[exercise.id]
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {exercise.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={generateNewExercises}
              className="mt-8 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Tentar Novos Exercícios
            </button>
          </div>
        ) : exercises.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Questão {currentExercise + 1} de {exercises.length}
              </span>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentTopic}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {exercises[currentExercise].question}
              </h3>

              <div className="space-y-3">
                {exercises[currentExercise].options.map((option, index) => {
                  const isAnswered = answeredQuestions.has(exercises[currentExercise].id);
                  const isSelected = selectedAnswers[exercises[currentExercise].id] === index;
                  const isCorrect = exercises[currentExercise].correctAnswer === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(exercises[currentExercise].id, index)}
                      disabled={isAnswered}
                      className={`w-full p-4 text-left rounded-xl transition-all ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                            : isSelected
                            ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                            : 'bg-gray-50 dark:bg-gray-700/50'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {option}
                          </span>
                        </div>
                        {isAnswered && (
                          isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : isSelected ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : null
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {answeredQuestions.has(exercises[currentExercise].id) && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <p className="text-gray-800 dark:text-gray-200">
                    {exercises[currentExercise].explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={nextExercise}
                disabled={!answeredQuestions.has(exercises[currentExercise].id)}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentExercise === exercises.length - 1 ? 'Ver Resultados' : 'Próxima Questão'}
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>Não foi possível carregar os exercícios. Tente novamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};
