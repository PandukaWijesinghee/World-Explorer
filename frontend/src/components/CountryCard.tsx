import { Link } from 'react-router-dom';
import { Heart, MapPin, Users, Globe2, ArrowRight, Star } from 'lucide-react';
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
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 transition-all duration-200 hover:scale-110"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={16} 
                className={`${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-200`} 
              />
            </button>
          )}
        </div>
        
        <div className="flex-grow p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                {country.name.common}
              </h2>
              {isFavorited && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="text-sm">{formatPopulation(country.population)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-secondary-500" />
                <span className="text-sm">{country.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-500" />
                <span className="text-sm">{country.capital?.join(', ') || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">View Details</span>
            <ArrowRight className="w-4 h-4 text-primary-500 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
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
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 transition-all duration-200 hover:scale-110"
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
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent line-clamp-1">
            {country.name.common}
          </h2>
          {isFavorited && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        
        <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-300 text-sm flex-grow">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="font-medium text-primary-600 dark:text-primary-400">Population:</span>
            <span>{formatPopulation(country.population)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-secondary-500" />
            <span className="font-medium text-secondary-600 dark:text-secondary-400">Region:</span>
            <span>{country.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span className="font-medium text-accent-600 dark:text-accent-400">Capital:</span>
            <span>{country.capital?.join(', ') || 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">View Details</span>
          <ArrowRight className="w-4 h-4 text-primary-500 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;