import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Calculator,
  Settings,
  BookOpen,
  PiSquare,
  Languages,
  Globe2,
  Microscope,
  GraduationCap,
  School,
  ArrowRight,
  History,
  FlaskConical,
  X
} from 'lucide-react';
import { Calculator as CalculatorComponent } from '../components/Calculator';
import { StudySettings } from '../components/StudySettings';

interface IconProps {
  Icon: React.ComponentType<any>;
}

const IconComponent: React.FC<IconProps> = ({ Icon }) => (
  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
    <Icon className="h-6 w-6" />
  </div>
);


// Subjects data structure remains the same as in your code
const subjects = {
  fundamental: [
    {
      name: 'Matemática',
      description: 'Números, Geometria, Medidas e outros conceitos básicos',
      color: 'from-blue-500 to-cyan-400',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      Icon: PiSquare,
      topics: {
        'Números e Operações': [
          'Números Naturais e Operações',
          'Frações e Números Decimais',
          'Operações com Números Inteiros',
          'Operações com Frações e Decimais',
          'Expressões Algébricas',
          'Equações do 1º Grau',
          'Sistemas de Equações',
          'Porcentagens e Proporções',
          'Potência',
        ],
        'Geometria e Medidas': [
          'Geometria Plana',
          'Geometria Espacial',
          'Medidas de Comprimento',
          'Medidas de Área',
          'Medidas de Volume',
          'Medidas de Tempo',
          'Sistemas de Unidades de Medida',
          'Teorema de Pitágoras', // Adicionado
          'Ângulos' // Adicionado
        ],
        'Análise de Dados': [
          'Estatística Básica',
          'Probabilidade',
          'Leitura e Interpretação de Gráficos e Tabelas',
          'Análise Combinatória Simples',
          'Média Aritmética' // Adicionado
        ],
        'Matemática Aplicada': [
          'Porcentagem e Juros',
          'Razão e Proporção',
          'Regra de Três',
          'Taxas, Porcentagens e Juros Simples',
          'Problemas Envolvendo Porcentagem',
          'Progressões Aritméticas (PA)',
          'Juros Simples e Compostos' // Adicionado
        ]
      }
    },
    {
      name: 'Língua Portuguesa',
      description: 'Leitura, Interpretação e Produção de Textos',
      color: 'from-purple-500 to-pink-400',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      Icon: Languages,
      topics: {
        'Leitura e Interpretação': [
          'Interpretação de Texto',
          'Tipos de Texto',
          'Gêneros Textuais',
          'Leitura e Interpretação de Textos Literários e Não Literários',
          'Identificação de Ideias Principais e Secundárias',
          'Compreensão de Textos Jornalísticos e Não-Verbais',
          'Análise de Discurso',
          'Inferência de Informações Implícitas',
          'Identificação de Ironia e Sarcasmo'
        ],
        'Gramática': [
          'Ortografia',
          'Acentuação',
          'Pontuação',
          'Classes Gramaticais',
          'Análise Sintática',
          'Concordância Verbal',
          'Concordância Nominal',
          'Uso de Pronomes, Preposições e Conjunções',
          'Semântica (Substituição de Palavras por Sinônimos)',
          'Regência Verbal e Nominal',
          'Colocação Pronominal',
          'Formação de Palavras (Prefixos e Sufixos)'
        ],
        'Produção Textual': [
          'Produção Textual',
          'Formação de Parágrafos e Coesão Textual',
          'Redação de Textos Argumentativos',
          'Coesão e Coerência',
          'Estrutura de Redação para o ENCCEJA',
          'Planejamento e Organização de Ideias',
          'Adequação ao Gênero Textual',
          'Revisão e Reescrita de Textos'
        ],
        'Linguística': [
          'Variação Linguística',
          'Variedades Linguísticas',
          'Figuras de Linguagem',
          'Análise de Frases e Períodos',
          'Funções da Linguagem',
          'Sociolinguística',
          'Pragmática',
          'Semiótica'
        ]
      }
    },
    {
      name: 'História e Geografia',
      description: 'Espaço, Tempo, Sociedade e Cidadania',
      color: 'from-green-500 to-emerald-400',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      Icon: Globe2,
      topics: {
        'História': [
          'Brasil Colônia',
          'Brasil Império',
          'Brasil República',
          'Era Vargas',
          'Ditadura Militar',
          'Redemocratização',
          'História do Brasil: Formação e Colônia',
          'O Brasil Imperial e a Independência',
          'História Contemporânea Brasileira',
          'Movimentos Políticos pelos Direitos dos Índios',
          'A Cidade e o Campo no Brasil Contemporâneo',
          'Estado e Democracia no Brasil'
        ],
        'História Mundial': [
          'Primeira Guerra Mundial',
          'Segunda Guerra Mundial',
          'Guerra Fria',
          'Neolítico',
          'Paleolítico',
          'Protagonistas da História Mundial',
          'Revoluções e Conflitos Mundiais',
          'Escravidão na Antiguidade',
          'Industrialização nas Sociedades Modernas',
          'Imperialismo e suas Consequências'
        ],
        'Geografia': [
          'Regiões do Brasil',
          'Urbanização',
          'Industrialização',
          'Clima e Vegetação',
          'Relevo e Hidrografia',
          'População Brasileira',
          'O Processo de Urbanização no Brasil',
          'Cartografia Básica',
          'Mudanças Climáticas Introdução',
          'Confrontos Sociais e Território Nacional',
          'Mudanças no Espaço Geográfico do Brasil',
          'As Sociedades e os Ambientes'
        ],
        'Temas Contemporâneos': [
          'Problemas Ambientais',
          'Globalização',
          'Geopolítica Contemporânea',
          'Recursos Naturais e Sustentabilidade',
          'O Papel das Organizações Internacionais',
          'Direitos e Deveres',
          'Democracia',
          'Cidadania e Participação',
          'Desenvolvimento Sustentável',
          'Trabalho e Sociedade',
          'Movimentos Sociais e Econômicos no Mundo Contemporâneo'
        ]
      }
    },
    {
        name: 'Ciências Naturais',
        description: 'Vida, Ambiente, Ser Humano e Saúde',
        color: 'from-orange-500 to-amber-400',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        Icon: Microscope,
        topics: {
          'Biologia': [
            'Células e Tecidos',
            'Sistemas do Corpo Humano',
            'Alimentação e Nutrição',
            'Doenças e Prevenção',
            'Reprodução Humana',
            'Genética Básica',
            'Funções e Organismos do Corpo Humano',
            'Ciclo de Vida dos Seres Vivos',
            'Classificação dos Seres Vivos',
            'Adaptações dos Organismos ao Meio'
          ],
          'Física e Química': [
            'Movimentos e Velocidade',
            'Força e Energia',
            'Leis de Newton',
            'Eletricidade Básica',
            'Calor e Temperatura',
            'Propriedades da Matéria',
            'Mudanças de Estado Físico',
            'Misturas e Separação de Substâncias',
            'Reações Químicas Básicas',
            'Transformações Químicas e Físicas',
            'Acidez e pH',
            'Uso de Recursos Energéticos'
          ],
          'Ecologia': [
            'Conceitos de Ecologia',
            'Cadeia Alimentar e Teias Tróficas',
            'Ciclo da Água',
            'Ciclo do Carbono e Nitrogênio',
            'Biodiversidade e Conservação',
            'Equilíbrio e Desequilíbrio Ecológico',
            'Relações Ecológicas entre os Organismos',
            'Impactos Ambientais Causados pelo Ser Humano'
          ],
          'Meio Ambiente': [
            'Poluição do Solo, Água e Ar',
            'Recursos Naturais Renováveis e Não Renováveis',
            'Sustentabilidade e Consumo Consciente',
            'Preservação do Meio Ambiente',
            'Fenômenos Naturais (Tsunamis, Terremotos, Furacões)',
            'Aquecimento Global e Mudanças Climáticas',
            'Energia Renovável e Alternativa',
            'Educação Ambiental',
            'Práticas de Reciclagem e Reutilização'
          ],
          'Saúde e Qualidade de Vida': [
            'Prevenção de Doenças',
            'Higiene e Saúde Pessoal',
            'Importância da Vacinação',
            'Saúde Mental e Física',
            'Primeiros Socorros',
            'Doenças Transmissíveis e Não Transmissíveis',
            'Hábitos de Vida Saudáveis'
          ],
          'Tecnologia e Ciência': [
            'Avanços na Medicina',
            'Tecnologia no Cotidiano',
            'Impacto da Ciência na Sociedade',
            'Exploração do Espaço e Sistema Solar',
            'Uso Responsável de Recursos Naturais',
            'Biotecnologia e Engenharia Genética'
          ]
        }
      }      
  ],
  medio: [
    {
      name: 'Matemática',
      description: 'Álgebra, Geometria, Estatística e Probabilidade',
      color: 'from-blue-500 to-cyan-400',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      Icon: PiSquare,
      topics: {
        'Álgebra': [
          'Funções do 1º Grau',
          'Funções do 2º Grau',
          'Função Exponencial',
          'Função Logarítmica',
          'Progressão Aritmética',
          'Progressão Geométrica',
          'Matrizes e Determinantes',
          'Equações e Inequações'
        ],
        'Geometria': [
          'Trigonometria no Triângulo',
          'Trigonometria na Circunferência',
          'Geometria Plana Avançada',
          'Geometria Espacial',
          'Geometria Analítica'
        ],
        'Análise de Dados': [
          'Medidas de Tendência Central',
          'Medidas de Dispersão',
          'Probabilidade',
          'Análise Combinatória',
          'Binômio de Newton',
          'Análise de Gráficos'
        ],
        'Matemática Aplicada': [
          'Juros Simples e Compostos',
          'Porcentagem Avançada',
          'Matemática Financeira: Juros, Descontos e Porcentagens',
          'Resolução de Problemas Complexos'
        ]
      }
    },
    {
      name: 'Linguagens',
      description: 'Português, Literatura, Artes e Língua Estrangeira',
      color: 'from-purple-500 to-pink-400',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      Icon: Languages,
      topics: {
        'Literatura': [
          'Literatura Portuguesa',
          'Trovadorismo e Humanismo',
          'Classicismo',
          'Barroco',
          'Arcadismo',
          'Romantismo',
          'Realismo e Naturalismo',
          'Parnasianismo e Simbolismo',
          'Modernismo',
          'Literatura Contemporânea',
          'Literatura Brasileira e Mundial'
        ],
        'Gramática e Linguística': [
          'Análise Sintática Avançada',
          'Período Composto',
          'Colocação Pronominal',
          'Figuras de Linguagem',
          'Estudos Linguísticos: Sintaxe, Morfologia e Semântica'
        ],
        'Produção Textual': [
          'Dissertação Argumentativa',
          'Coesão e Coerência',
          'Tipos de Argumentação',
          'Redação: Estrutura e Coesão'
        ],
        'Língua Estrangeira e Artes': [
          'Interpretação de Texto em Inglês',
          'Vocabulário Básico',
          'Tempos Verbais',
          'História da Arte',
          'Movimentos Artísticos',
          'Arte Contemporânea'
        ]
      }
    },
    {
      name: 'Ciências Humanas',
      description: 'História, Geografia, Filosofia e Sociologia',
      color: 'from-green-500 to-emerald-400',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      Icon: History,
      topics: {
        'História': [
          'Idade Antiga',
          'Idade Média',
          'Idade Moderna',
          'Revolução Industrial',
          'Revolução Francesa',
          'Imperialismo',
          'Primeira Guerra Mundial',
          'Segunda Guerra Mundial',
          'Guerra Fria',
          'Mundo Contemporâneo',
          'Formação do Brasil e o Processo de Colonização',
          'Movimentos Sociais no Brasil',
          'Ditadura Militar no Brasil',
          'Redemocratização e Constituição de 1988',
          'História da África e Cultura Afro-Brasileira',
          'Idade Média',
        ],
        'Geografia': [
          'Geopolítica Mundial',
          'Globalização',
          'Blocos Econômicos',
          'Conflitos Mundiais',
          'Urbanização',
          'Problemas Ambientais',
          'Geografia do Brasil',
          'Mudanças Climáticas Detalhadas',
          "Tromba D'Água",
          'Recursos Naturais e Sustentabilidade',
          'Demografia e Crescimento Populacional',
          'Agricultura e Questões Agrárias',
          'Industrialização e Economia Brasileira',
          'Questões Indígenas e Territoriais no Brasil'
        ],
        'Filosofia': [
          'Filosofia Antiga',
          'Filosofia Medieval',
          'Filosofia Moderna',
          'Ética e Moral',
          'Política',
          'Filosofia Política e Ética',
          'Existencialismo',
          'Racionalismo e Empirismo',
          'Contratualismo',
          'Filosofia Contemporânea',
          'Teorias do Conhecimento',
          'Filosofia da Ciência',
          'Filosofia da Linguagem',
          'Estética e Filosofia da Arte'
        ],
        'Sociologia': [
          'Cultura e Sociedade',
          'Movimentos Sociais',
          'Desigualdade Social',
          'Trabalho e Produção',
          'Movimentos Sociais e Econômicos no Mundo Contemporâneo',
          'Problemas Sociais e Cidadania no Brasil',
          'Antropologia',
          'Estratificação Social',
          'Instituições Sociais',
          'Globalização e Impactos Sociais',
          'Sociologia Urbana e Rural',
          'Educação e Sociedade',
          'Gênero e Sexualidade',
          'Mídia e Opinião Pública'
        ]
    }
    },
    {
      name: 'Ciências da Natureza',
      description: 'Física, Química e Biologia',
      color: 'from-orange-500 to-amber-400',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      Icon: FlaskConical,
      topics: {
        'Física': [
          'Leis de Newton',
          'Movimento Uniforme e Uniformemente Variado',
          'Trabalho e Energia',
          'Conservação da Energia Mecânica',
          'Calor e Temperatura',
          'Dilatação Térmica',
          'Propagação de Calor',
          'Reflexão e Refração da Luz',
          'Formação de Imagens em Espelhos e Lentes',
          'Leis de Ohm',
          'Circuitos Elétricos',
          'Potência Elétrica',
          'Resistores e Associação de Resistores',
          'Propriedades das Ondas',
          'Interferência e Difração',
          'Velocidade de Propagação de Ondas'
        ],
        'Química': [
          'Impactos Ambientais',
          'Reações Orgânicas',
          'Equilíbrios Químicos',
          'Funções Oxigenadas e Nitrogenadas',
          'Propriedades Físicas dos Compostos Orgânicos',
          'Cinética Química',
          'Separação de Misturas',
          'Átomo e Estrutura',
          'Tabela Periódica',
          'Ligações Químicas',
          'Funções Inorgânicas',
          'Estequiometria'
        ],
        'Biologia': [
          'Biotecnologia',
          'Transgênicos e Clonagem',
          'Fermentação',
          'Doenças Virais e Bacterianas',
          'Impacto das Atividades Humanas no Meio Ambiente',
          'Citologia',
          'Genética',
          'Evolução',
          'Ecologia',
          'Fisiologia Humana',
          'Botânica',
          'Zoologia'
        ]
      }
    }
  ]
};

const LevelSubjects = () => {
  const { level } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const currentLevel = level as keyof typeof subjects;
  const currentSubjects = subjects[currentLevel] || [];

  const filteredSubjects = currentSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(subject.topics).some(topicArray =>
      topicArray.some(topic =>
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const handleShowAllTopics = (subject: any) => {
    setSelectedSubject(subject);
    setShowAllTopics(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {level === 'fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'}
          </h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar matérias ou tópicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
            />
          </div>
        </div>

        {/* Modal para mostrar todos os tópicos */}
        {showAllTopics && selectedSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedSubject.name} - Todos os Tópicos
                </h3>
                <button
                  onClick={() => setShowAllTopics(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {Object.entries(selectedSubject.topics).map(([category, topics]) => (
                  <div key={category} className={`${selectedSubject.bgColor} dark:bg-gray-700/50 rounded-lg p-4 mb-4`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(topics as string[]).map((topic) => (
                        <Link
                          key={topic}
                          to={`/conteudo/${level}/${selectedSubject.name}/${encodeURIComponent(topic)}`}
                          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-gray-800 p-3 rounded-lg transition-colors"
                        >
                          <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{topic}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista de matérias */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.name}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className={`${subject.textColor}`}>
                    <IconComponent Icon={subject.Icon} />
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white ml-3">
                    {subject.name}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {subject.description}
                </p>
                <div className="space-y-4">
                  {Object.entries(subject.topics).map(([category, topics]) => (
                    <div key={category} className={`${subject.bgColor} dark:bg-gray-700/50 rounded-lg p-4`}>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {(topics as string[]).slice(0, 4).map((topic) => (
                          <Link
                            key={topic}
                            to={`/conteudo/${level}/${subject.name}/${encodeURIComponent(topic)}`}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            {topic}
                          </Link>
                        ))}
                      </div>
                      {(topics as string[]).length > 4 && (
                        <button
                          onClick={() => handleShowAllTopics(subject)}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-2 font-medium"
                        >
                          Ver mais {(topics as string[]).length - 4} tópicos...
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <CalculatorComponent
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />

        <StudySettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
};

export default LevelSubjects;
