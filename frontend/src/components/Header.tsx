import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleIcon from './SimpleIcon';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-800 dark:text-white">
              <SimpleIcon name="globe" className="w-6 h-6" />
              <span className="text-xl font-bold">World Explorer</span>
            </Link>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 md:hidden"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <span className="text-2xl">☀️</span>
              ) : (
                <span className="text-2xl">🌙</span>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200"
              />
              <SimpleIcon name="search" className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </form>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className="hidden md:flex p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <span className="text-2xl">☀️</span>
                ) : (
                  <span className="text-2xl">🌙</span>
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/favorites" 
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <SimpleIcon name="user" className="w-4 h-4" />
                    <span className="hidden md:inline">{currentUser?.name}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="Log out"
                  >
                    <SimpleIcon name="logOut" className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;