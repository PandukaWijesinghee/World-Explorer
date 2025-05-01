import { Globe, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">World Explorer</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
              Discover the world through our comprehensive country database. Learn about different cultures, populations, and more.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
            <nav className="flex flex-col items-center gap-2">
              <Link 
                to="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/favorites" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Favorites
              </Link>
              <Link 
                to="/search" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Search
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Source</h4>
            <a 
              href="https://restcountries.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
            >
              REST Countries API
            </a>
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
              © {currentYear} World Explorer. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 animate-pulse-slow" />
              <span>using React & Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;