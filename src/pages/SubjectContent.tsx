import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Loader2, BookMarked, AlertCircle, BrainCircuit, ArrowLeft } from 'lucide-react';
import { generateSubjectContent } from '../services/gemini';
import { Link } from 'react-router-dom';

const topics = {
  fundamental: {
    'matemática': [
      'Números Naturais e Operações',
      'Números Decimais e Frações',
      'Porcentagem Básica',
      'Geometria Plana Básica',
      'Medidas de Comprimento e Área',
      'Medidas de Tempo e Massa',
      'Gráficos e Tabelas Simples',
      'Resolução de Problemas'
    ],
    'língua portuguesa': [
      'Interpretação de Texto Básica',
      'Tipos de Texto',
      'Ortografia',
      'Separação de Sílabas',
      'Substantivos e Adjetivos',
      'Verbos - Tempos Básicos',
      'Pontuação Básica',
      'Produção de Texto'
    ],
    'história e geografia': [
      'História do Brasil Colônia',
      'Independência e República',
      'Geografia do Brasil',
      'Regiões Brasileiras',
      'Mapas e Localização',
      'Meio Ambiente',
      'Cidadania',
      'Direitos e Deveres'
    ],
    'ciências naturais': [
      'Corpo Humano',
      'Alimentação e Saúde',
      'Seres Vivos',
      'Meio Ambiente',
      'Matéria e Energia',
      'Água e Solo',
      'Sistema Solar',
      'Fenômenos Naturais'
    ]
  },
  medio: {
    'matemática': [
      'Funções de 1º e 2º Grau',
      'Geometria Espacial',
      'Trigonometria Básica',
      'Análise de Dados',
      'Probabilidade',
      'Matemática Financeira',
      'Progressões',
      'Sistemas Lineares'
    ],
    'linguagens': [
      'Gêneros Textuais',
      'Literatura Brasileira',
      'Figuras de Linguagem',
      'Análise Sintática',
      'Variação Linguística',
      'Interpretação Avançada',
      'Redação',
      'Inglês Básico'
    ],
    'ciências humanas': [
      'Brasil República',
      'Guerras Mundiais',
      'Geografia Política',
      'Globalização',
      'Filosofia Moderna',
      'Sociologia',
      'Movimentos Sociais',
      'Economia e Trabalho'
    ],
    'ciências da natureza': [
      'Mecânica Básica',
      'Eletricidade',
      'Química Orgânica',
      'Reações Químicas',
      'Genética',
      'Ecologia',
      'Biotecnologia',
      'Física Moderna'
    ]
  }
};

const SubjectContent = () => {
  const { level, subject } = useParams();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjectTopics = level && subject ? 
    topics[level as keyof typeof topics]?.[subject.toLowerCase() as keyof typeof topics['fundamental' | 'medio']] || [] 
    : [];

  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    setError('');

    try {
      const generatedContent = await generateSubjectContent(subject || '', topic);
      setContent(generatedContent);
    } catch (err) {
      setError('Erro ao carregar o conteúdo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/materias" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para Matérias
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <BookMarked className="h-10 w-10 mr-4 text-indigo-600" />
            {subject}
            <span className="ml-4 text-lg text-gray-500">
              ({level === 'fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'})
            </span>
          </h1>
          <p className="text-xl text-gray-600 flex items-center">
            <BrainCircuit className="h-6 w-6 mr-3 text-indigo-500" />
            Escolha um tópico para estudar com conteúdo detalhado
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Topics Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tópicos de Estudo</h3>
              <div className="space-y-2">
                {subjectTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedTopic === topic
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-indigo-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <BookOpen className={`h-5 w-5 mr-3 ${
                        selectedTopic === topic ? 'text-white' : 'text-indigo-600'
                      }`} />
                      <span className="font-medium">{topic}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900">Gerando conteúdo detalhado...</p>
                    <p className="text-gray-500">Isso pode levar alguns segundos</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center min-h-[600px] text-red-600">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  {error}
                </div>
              ) : content ? (
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-3xl font-bold text-indigo-900 mb-8 pb-4 border-b border-indigo-100">
                    {selectedTopic}
                  </h2>
                  <div className="text-gray-800 leading-relaxed">
                    {content.split('\n\n').map((section, index) => {
                      if (section.startsWith('**')) {
                        const title = section.replace(/\*\*/g, '').split('\n')[0];
                        const content = section.split('\n').slice(1).join('\n');
                        
                        return (
                          <div key={index} className="mb-8">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                              {title}
                            </h3>
                            <div className="pl-4 space-y-3">
                              {content.split('•').map((item, i) => {
                                if (!item.trim()) return null;

                                const formattedItem = item
                                  .replace(/\$/g, '')
                                  .replace(/\^2/g, '²')
                                  .replace(/\^3/g, '³')
                                  .replace(/\*/g, '×')
                                  .trim();
                                
                                return (
                                  <div key={i} className="flex items-start">
                                    <span className="text-indigo-500 mr-2">•</span>
                                    <p className="mt-0 font-medium">{formattedItem}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      if (section.startsWith('[')) {
                        return (
                          <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6">
                            <h4 className="font-bold text-lg text-indigo-700 mb-3">
                              {section.split('\n')[0]}
                            </h4>
                            <div className="pl-4 space-y-2">
                              {section.split('\n').slice(1).map((line, i) => (
                                line.trim() && (
                                  <p key={i} className="text-gray-700">
                                    {line.trim().startsWith('•') ? line.trim().substring(1) : line}
                                  </p>
                                )
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return section.trim() && (
                        <p key={index} className="mb-6 text-gray-700">
                          {section}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="min-h-[600px] flex items-center justify-center text-gray-500">
                  <p>Selecione um tópico para visualizar o conteúdo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectContent;
