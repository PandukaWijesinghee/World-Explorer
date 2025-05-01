import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Country } from '../types/Country';
import { useAuth } from '../context/AuthContext';

interface CountryCardProps {
  country: Country;
  viewMode: 'grid' | 'list';
}

const CountryCard = ({ country, viewMode }: CountryCardProps) => {
  const { isAuthenticated, isCountryFavorited, addFavoriteCountry, removeFavoriteCountry } = useAuth();
  const isFavorited = isCountryFavorited(country.cca3);

  const formatPopulation = (population: number): string => {
    return new Intl.NumberFormat().format(population);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      removeFavoriteCountry(country.cca3);
    } else {
      addFavoriteCountry(country.cca3);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/country/${country.cca3}`} 
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center animate-fadeIn"
      >
        <div className="w-32 h-24 flex-shrink-0">
          <img 
            src={country.flags.svg} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-grow p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {country.name.common}
            </h2>
            <div className="flex gap-8 text-gray-600 dark:text-gray-300">
              <div>
                <span className="font-semibold">Population:</span> {formatPopulation(country.population)}
              </div>
              <div>
                <span className="font-semibold">Region:</span> {country.region}
              </div>
              <div>
                <span className="font-semibold">Capital:</span> {country.capital?.join(', ') || 'N/A'}
              </div>
            </div>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 ml-4"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={20} 
                className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} 
              />
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/country/${country.cca3}`} 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 animate-fadeIn"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={country.flags.svg} 
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
        {isAuthenticated && (
          <button 
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} 
            />
          </button>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-1">
          {country.name.common}
        </h2>
        
        <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-300 text-sm flex-grow">
          <p>
            <span className="font-semibold">Population:</span> {formatPopulation(country.population)}
          </p>
          <p>
            <span className="font-semibold">Region:</span> {country.region}
          </p>
          <p>
            <span className="font-semibold">Capital:</span> {country.capital?.join(', ') || 'N/A'}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;