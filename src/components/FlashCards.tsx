import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, X, ChevronLeft, ChevronRight, Shuffle, Loader2, Wand2, Trash2 } from 'lucide-react';
import { generateFlashCards } from '../services/gemini';

interface FlashCardsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject?: string;
  currentTopic?: string;
}

interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

export const FlashCards: React.FC<FlashCardsProps> = ({ 
  isOpen, 
  onClose,
  currentSubject,
  currentTopic
}) => {
  const [cards, setCards] = useState<FlashCard[]>(() => {
    const savedCards = localStorage.getItem('flashCards');
    return savedCards ? JSON.parse(savedCards) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('flashCards', JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newCard: FlashCard = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
      };
      setCards([...cards, newCard]);
      setNewQuestion('');
      setNewAnswer('');
      setShowAddCard(false);
    }
  };

  const generateAICards = async () => {
    if (!currentSubject || !currentTopic) return;

    setIsGenerating(true);
    try {
      const generatedCards = await generateFlashCards(currentSubject, currentTopic);
      const newCards = generatedCards.map(card => ({
        id: Date.now().toString() + Math.random(),
        question: card.question,
        answer: card.answer
      }));
      setCards([...cards, ...newCards]);
      setCurrentIndex(cards.length); // Move para o primeiro card novo
    } catch (error) {
      console.error('Erro ao gerar flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteCard = (id: string) => {
    const newCards = cards.filter(card => card.id !== id);
    setCards(newCards);
    if (currentIndex >= newCards.length) {
      setCurrentIndex(Math.max(0, newCards.length - 1));
    }
    setCardToDelete(null);
  };

  const deleteAllCards = () => {
    setCards([]);
    setCurrentIndex(0);
    setShowDeleteConfirm(false);
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-96">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <h3 className="text-lg font-semibold dark:text-white">Flash Cards</h3>
        </div>
        <div className="flex items-center gap-2">
          {cards.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
              title="Excluir todos os cards"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          {currentSubject && currentTopic && (
            <button
              onClick={generateAICards}
              disabled={isGenerating}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg flex items-center gap-2 disabled:opacity-50"
              title="Gerar cards com IA"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="h-5 w-5" />
              )}
            </button>
          )}
          <button
            onClick={() => setShowAddCard(true)}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Confirmação de exclusão de todos os cards */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center z-50">
          <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Excluir todos os flash cards?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-4">
            <button
              onClick={deleteAllCards}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir Todos
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Confirmação de exclusão de card individual */}
      {cardToDelete && (
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-lg p-4 flex flex-col items-center justify-center z-40">
          <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Excluir este flash card?
          </h4>
          <div className="flex gap-4">
            <button
              onClick={() => deleteCard(cardToDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir
            </button>
            <button
              onClick={() => setCardToDelete(null)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showAddCard ? (
        <div className="space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Digite a pergunta..."
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            rows={3}
          />
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Digite a resposta..."
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={addCard}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Adicionar Card
            </button>
            <button
              onClick={() => setShowAddCard(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : cards.length > 0 ? (
        <>
          <div
            className="min-h-[200px] bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 mb-4 cursor-pointer relative group"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="text-center">
              <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                Card {currentIndex + 1} de {cards.length}
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {showAnswer ? cards[currentIndex].answer : cards[currentIndex].question}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Clique para {showAnswer ? 'ver a pergunta' : 'ver a resposta'}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCardToDelete(cards[currentIndex].id);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={shuffleCards}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full"
            >
              <Shuffle className="h-5 w-5" />
            </button>
            <button
              onClick={nextCard}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p>Gerando flashcards com IA...</p>
            </div>
          ) : (
            <>
              Nenhum flash card criado ainda.
              <br />
              {currentSubject && currentTopic ? (
                <button
                  onClick={generateAICards}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2 mx-auto"
                >
                  <Wand2 className="h-5 w-5" />
                  Gerar cards com IA
                </button>
              ) : (
                "Clique no + para adicionar!"
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};