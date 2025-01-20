import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Encceja Aprender</h3>
            <p className="text-sm text-indigo-200">
              Seu caminho para o sucesso no ENCCEJA
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>para a educação brasileira</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;