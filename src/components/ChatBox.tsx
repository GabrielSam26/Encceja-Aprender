import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject?: string;
  currentTopic?: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const suggestedQuestions = [
  "Pode me explicar isso de forma mais simples?",
  "Qual a aplicação prática disso?",
  "Quais são os conceitos principais?",
  "Pode dar mais exemplos?"
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  isOpen,
  onClose,
  currentSubject,
  currentTopic
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: `Olá! Estou aqui para ajudar com suas dúvidas sobre ${currentTopic} em ${currentSubject}. Como posso ajudar?`
        }
      ]);
    }
  }, [isOpen, currentSubject, currentTopic]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (question: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Você é um tutor especializado em ${currentSubject}, ajudando com dúvidas sobre ${currentTopic}.
      
Responda à seguinte pergunta de forma clara, didática e adequada ao nível ENCCEJA:

${question}

Regras para a resposta:
1. Use linguagem simples e acessível
2. Dê exemplos práticos quando possível
3. Mantenha a resposta concisa (máximo 4 parágrafos)
4. Foque nos pontos principais
5. Use analogias do cotidiano quando apropriado
6. Se houver fórmulas, explique cada termo
7. Termine com uma dica prática ou resumo`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      throw new Error('Não foi possível gerar uma resposta. Tente novamente.');
    }
  };

  const handleSend = async (question?: string) => {
    const messageContent = question || inputValue;
    if (!messageContent.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setShowSuggestions(false);

    // Add loading message
    const loadingId = Date.now().toString() + '-loading';
    setMessages(prev => [...prev, {
      id: loadingId,
      type: 'assistant',
      content: '',
      loading: true
    }]);

    try {
      const response = await generateResponse(messageContent);
      
      // Remove loading message and add response
      setMessages(prev => [
        ...prev.filter(m => m.id !== loadingId),
        {
          id: Date.now().toString(),
          type: 'assistant',
          content: response
        }
      ]);
    } catch (error) {
      // Remove loading message and add error message
      setMessages(prev => [
        ...prev.filter(m => m.id !== loadingId),
        {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.'
        }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Assistente de Estudos</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {message.loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Gerando resposta...</span>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {showSuggestions && (
        <div className="px-4 pb-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Sparkles className="h-4 w-4 mr-1" />
            <span>Sugestões de perguntas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSend(question)}
                className="text-sm px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta..."
            className="w-full pl-4 pr-12 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};