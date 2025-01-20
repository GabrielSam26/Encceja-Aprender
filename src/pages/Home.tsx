import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Target, ArrowRight, Users, Award, BookOpenCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Changelog } from '../components/Changelog';

const Home = () => {
  useEffect(() => {
    const updateMousePosition = (e) => {
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(elem => {
        const speed = elem.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        elem.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', updateMousePosition);
    return () => document.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="parallax absolute top-20 left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" data-speed="2"></div>
          <div className="parallax absolute top-40 right-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" data-speed="3"></div>
          <div className="parallax absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" data-speed="4"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                ENCCEJA Aprender
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Sua jornada para a aprovação começa aqui. Aprenda de forma interativa e personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/fundamental"
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-2xl"
                >
                  Ensino Fundamental
                  <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/medio"
                  className="group flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-2xl border-2 border-indigo-600"
                >
                  Ensino Médio
                  <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <BookOpenCheck className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
                <div className="text-lg font-bold text-gray-900 dark:text-white">Flashcards</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Memorização eficiente</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <Brain className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
                <div className="text-lg font-bold text-gray-900 dark:text-white">Mapa Mental</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Organize seus estudos</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <Target className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
                <div className="text-lg font-bold text-gray-900 dark:text-white">Exercícios IA</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Personalizados para você</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
              >
                <Clock className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
                <div className="text-lg font-bold text-gray-900 dark:text-white">Pomodoro</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Gerencie seu tempo</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: BookOpen,
                title: "Conteúdo Estruturado",
                description: "Material didático organizado em módulos progressivos para seu melhor aprendizado"
              },
              {
                icon: Brain,
                title: "Inteligência Artificial",
                description: "Sistema adaptativo que gera conteudo personalizado de acordo com o topico"
              },
              {
                icon: Target,
                title: "Foco no Resultado",
                description: "Metodologia comprovada com alto índice de aprovação no ENCCEJA"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog Section */}
      <Changelog />

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg mb-4">
            Desenvolvido por <strong>Gabriel Passos</strong>
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:gabrielsamdev@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition">
              gabrielsamdev@gmail.com
            </a>
            <a href="https://github.com/GabrielSam26" className="text-indigo-400 hover:text-indigo-300 transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;