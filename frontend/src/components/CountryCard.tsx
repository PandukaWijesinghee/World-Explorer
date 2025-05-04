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
        className="card flex items-center group hover:shadow-glow transition-all duration-300"
      >
        <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden">
          <img 
            src={country.flags.svg} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="flex-grow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-2">
              {country.name.common}
            </h2>
            <div className="flex gap-8 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary-600 dark:text-primary-400">Population:</span>
                <span>{formatPopulation(country.population)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-secondary-600 dark:text-secondary-400">Region:</span>
                <span>{country.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-accent-600 dark:text-accent-400">Capital:</span>
                <span>{country.capital?.join(', ') || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 ml-4 transition-all duration-200 hover:scale-110"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={20} 
                className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-200`} 
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
      className="card flex flex-col h-full transform hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={country.flags.svg} 
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {isAuthenticated && (
          <button 
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 transition-all duration-200 hover:scale-110"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-200`} 
            />
          </button>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-3 line-clamp-1">
          {country.name.common}
        </h2>
        
        <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-300 text-sm flex-grow">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Population:</span>
            <span>{formatPopulation(country.population)}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold text-secondary-600 dark:text-secondary-400">Region:</span>
            <span>{country.region}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold text-accent-600 dark:text-accent-400">Capital:</span>
            <span>{country.capital?.join(', ') || 'N/A'}</span>
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-lg transition-all duration-200 group-hover:shadow-glow">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;