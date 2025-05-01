import { useEffect, useState } from 'react';
import { Country } from '../types/Country';
import { getCountriesByCodes } from '../api/countriesAPI';
import CountryList from '../components/CountryList';
import { useAuth } from '../context/AuthContext';
import { Heart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!isAuthenticated || !currentUser || currentUser.favoriteCountries.length === 0) {
        setFavoriteCountries([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getCountriesByCodes(currentUser.favoriteCountries);
        setFavoriteCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch favorite countries. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [currentUser, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be logged in to access your favorite countries.
          </p>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-red-500 w-6 h-6 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Favorite Countries
          </h1>
        </div>
        
        {!isLoading && favoriteCountries.length === 0 && !error ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              No favorite countries yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Explore countries and add them to your favorites list!
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Countries
            </Link>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <CountryList 
              countries={favoriteCountries}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default FavoritesPage;