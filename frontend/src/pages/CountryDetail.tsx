import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { Country } from '../types/Country';
import { getCountryByCode, getCountriesByCodes } from '../api/countriesAPI';
import { useAuth } from '../context/AuthContext';

const CountryDetail = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, isCountryFavorited, addFavoriteCountry, removeFavoriteCountry } = useAuth();
  const isFavorited = country ? isCountryFavorited(country.cca3) : false;

  useEffect(() => {
    const fetchCountryData = async () => {
      if (!countryCode) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch country details
        const countryData = await getCountryByCode(countryCode);
        setCountry(countryData);
        
        // Fetch border countries if any
        if (countryData.borders && countryData.borders.length > 0) {
          const borderData = await getCountriesByCodes(countryData.borders);
          setBorderCountries(borderData);
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        setError('Failed to fetch country details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleFavoriteToggle = () => {
    if (!country) return;
    
    if (isFavorited) {
      removeFavoriteCountry(country.cca3);
    } else {
      addFavoriteCountry(country.cca3);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {error || 'Country not found'}
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 shadow-md rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Link>
          
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                isFavorited 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              } shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <Heart 
                size={18} 
                className={`mr-2 ${isFavorited ? 'fill-current' : ''}`} 
              />
              {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={country.flags.svg} 
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {country.name.common}
              </h1>
              
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-2">
                  <span className="font-semibold">Official Name:</span> {country.name.official}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-6">
                  <p><span className="font-semibold">Population:</span> {formatNumber(country.population)}</p>
                  <p><span className="font-semibold">Region:</span> {country.region}</p>
                  <p><span className="font-semibold">Sub Region:</span> {country.subregion || 'N/A'}</p>
                  <p><span className="font-semibold">Capital:</span> {country.capital?.join(', ') || 'N/A'}</p>
                  
                  <p>
                    <span className="font-semibold">Languages:</span>{' '}
                    {country.languages 
                      ? Object.values(country.languages).join(', ') 
                      : 'N/A'}
                  </p>
                  
                  <p>
                    <span className="font-semibold">Currencies:</span>{' '}
                    {country.currencies 
                      ? Object.values(country.currencies)
                          .map(currency => `${currency.name} (${currency.symbol})`)
                          .join(', ') 
                      : 'N/A'}
                  </p>
                  
                  <p>
                    <span className="font-semibold">Top Level Domain:</span>{' '}
                    {country.tld?.join(', ') || 'N/A'}
                  </p>
                  
                  <p className="md:col-span-2">
                    <span className="font-semibold">Area:</span>{' '}
                    {formatNumber(country.area)} km²
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    Border Countries:
                  </h2>
                  {borderCountries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {borderCountries.map(border => (
                        <Link 
                          key={border.cca3}
                          to={`/country/${border.cca3}`}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {border.name.common}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No bordering countries</p>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    More Information:
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a 
                      href={country.maps.googleMaps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Google Maps
                    </a>
                    
                    <a 
                      href={country.maps.openStreetMaps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      OpenStreetMap
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;