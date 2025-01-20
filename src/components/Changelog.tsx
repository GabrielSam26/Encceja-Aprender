import React, { useState } from 'react';
import { Newspaper, ChevronDown, ChevronUp, Calendar, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Update {
  date: string;
  version: string;
  highlights: string[];
  changes: {
    type: 'new' | 'improvement' | 'fix';
    description: string;
  }[];
}

const updates: Update[] = [
  {
    date: '15 Jan 2025',
    version: '1.2.0',
    highlights: [
      'Sistema de Exercícios com IA',
      'Novo design responsivo',
      'Melhor desempenho geral'
    ],
    changes: [
      { type: 'new', description: 'Adicionado sistema de exercícios personalizados com IA' },
      { type: 'new', description: 'Implementado changelog para acompanhar novidades' },
      { type: 'improvement', description: 'Interface redesenhada para melhor experiência mobile' },
      { type: 'improvement', description: 'Otimização no carregamento de conteúdo' },
      { type: 'fix', description: 'Correção do bug na exibição de fórmulas matemáticas será feita em breve' }
    ]
  },
  {
    date: '13 Jan 2025',
    version: '1.1.0',
    highlights: [
      'Flash Cards Interativos',
      'Modo Escuro'
    ],
    changes: [
      { type: 'new', description: 'Sistema de flash cards para estudo' },
      { type: 'new', description: 'Adicionado modo escuro' },
      { type: 'improvement', description: 'Melhorias na navegação' },
      { type: 'fix', description: 'Correções na calculadora' }
    ]
  },
  {
    date: '11 Jan 2025',
    version: '1.0.0',
    highlights: [
      'Lançamento Inicial'
    ],
    changes: [
      { type: 'new', description: 'Primeira versão do ENCCEJA Aprender' },
      { type: 'new', description: 'Integração Prompts IA conteudo Ensino Fundamental e Médio' },
      { type: 'new', description: 'Calculadora e timer pomodoro' }
    ]
  }
];

export const Changelog: React.FC = () => {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(updates[0].version);

  const getChangeTypeIcon = (type: 'new' | 'improvement' | 'fix') => {
    switch (type) {
      case 'new':
        return <Sparkles className="h-4 w-4 text-green-500" />;
      case 'improvement':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'fix':
        return <span className="text-red-500">•</span>;
    }
  };

  const getChangeTypeColor = (type: 'new' | 'improvement' | 'fix') => {
    switch (type) {
      case 'new':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'improvement':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'fix':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-200 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Newspaper className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            Novidades
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Acompanhe as últimas atualizações e melhorias da plataforma
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update) => (
            <div
              key={update.version}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedVersion(
                  expandedVersion === update.version ? null : update.version
                )}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {update.date}
                  </span>
                  <span className="ml-3 px-2 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded">
                    v{update.version}
                  </span>
                </div>
                {expandedVersion === update.version ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedVersion === update.version && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >
                    <div className="px-6 py-4">
                      {/* Highlights */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                          Destaques
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {update.highlights.map((highlight, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Changes */}
                      <div className="space-y-3">
                        {update.changes.map((change, index) => (
                          <div
                            key={index}
                            className={`flex items-start p-2 rounded-lg ${getChangeTypeColor(change.type)}`}
                          >
                            <span className="mt-1 mr-2">
                              {getChangeTypeIcon(change.type)}
                            </span>
                            <span>{change.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};