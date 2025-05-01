import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CountryDetail from './pages/CountryDetail';
import SearchResults from './pages/SearchResults';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Initialize demo user in localStorage if not exists
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'password123',
        favoriteCountries: ['USA', 'FRA', 'JPN']
      };
      localStorage.setItem('users', JSON.stringify([demoUser]));
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                  <HomePage />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/country/:countryCode" 
              element={
                <>
                  <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                  <CountryDetail />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/search" 
              element={
                <>
                  <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                  <SearchResults />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <>
                  <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                  <FavoritesPage />
                  <Footer />
                </>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;