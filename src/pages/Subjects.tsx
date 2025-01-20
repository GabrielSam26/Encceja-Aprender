import React, { useState } from 'react';
import { Book, GraduationCap, School } from 'lucide-react';
import { Link } from 'react-router-dom';

const subjects = {
  fundamental: [
    {
      id: 1,
      name: 'Matemática',
      description: 'Números, Geometria, Medidas e outros conceitos básicos',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 2,
      name: 'Língua Portuguesa',
      description: 'Leitura, Interpretação e Produção de Textos',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 3,
      name: 'História e Geografia',
      description: 'Espaço, Tempo, Sociedade e Cidadania',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 4,
      name: 'Ciências Naturais',
      description: 'Vida, Ambiente, Ser Humano e Saúde',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=500'
    }
  ],
  medio: [
    {
      id: 5,
      name: 'Matemática',
      description: 'Álgebra, Geometria, Estatística e Probabilidade',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 6,
      name: 'Linguagens',
      description: 'Português, Literatura, Artes e Língua Estrangeira',
      image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 7,
      name: 'Ciências Humanas',
      description: 'História, Geografia, Filosofia e Sociologia',
      image: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 8,
      name: 'Ciências da Natureza',
      description: 'Física, Química e Biologia',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=500'
    }
  ]
};

const Subjects = () => {
  const [selectedLevel, setSelectedLevel] = useState<'fundamental' | 'medio'>('fundamental');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Matérias do ENCCEJA
        </h1>
        <p className="text-xl text-gray-600">
          Escolha seu nível de ensino e comece seus estudos
        </p>
      </div>

      {/* Nível de Ensino Selector */}
      <div className="flex justify-center space-x-4 mb-12">
        <button
          onClick={() => setSelectedLevel('fundamental')}
          className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
            selectedLevel === 'fundamental'
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-indigo-50'
          }`}
        >
          <School className="h-5 w-5 mr-2" />
          Ensino Fundamental
        </button>
        <button
          onClick={() => setSelectedLevel('medio')}
          className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
            selectedLevel === 'medio'
              ? 'bg-indigo-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-indigo-50'
          }`}
        >
          <GraduationCap className="h-5 w-5 mr-2" />
          Ensino Médio
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {subjects[selectedLevel].map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={subject.image}
                alt={subject.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {subject.name}
                </h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">{subject.description}</p>
              <Link
                to={`/materias/${selectedLevel}/${subject.name}`}
                className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-center text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Começar Estudos
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;