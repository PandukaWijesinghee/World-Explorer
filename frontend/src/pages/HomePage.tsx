import { useEffect, useState } from 'react';
import { Country } from '../types/Country';
import { getAllCountries } from '../api/countriesAPI';
import CountryList from '../components/CountryList';

const HomePage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Starting to fetch countries...');
        const data = await getAllCountries();
        console.log('Countries data received:', data.length);
        if (data.length === 0) {
          setError('No countries data available. Please try again later.');
        } else {
          setCountries(data);
        }
      } catch (err) {
        console.error('Error in HomePage:', err);
        setError('Failed to fetch countries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Explore Countries Around the World
        </h1>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading countries...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!isLoading && !error && (
          <div className="rounded-lg overflow-hidden">
            <CountryList 
              countries={countries}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;