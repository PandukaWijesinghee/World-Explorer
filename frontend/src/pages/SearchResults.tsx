import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Country } from '../types/Country';
import { searchCountriesByName } from '../api/countriesAPI';
import CountryList from '../components/CountryList';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      if (!searchQuery) {
        setCountries([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await searchCountriesByName(searchQuery);
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Search className="text-blue-500 w-6 h-6 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Search results for "{searchQuery}"
          </h1>
        </div>
        
        <div className="rounded-lg overflow-hidden">
          <CountryList 
            countries={countries}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
};

export default SearchResults;