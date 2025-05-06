import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { Country } from '../types/Country';
import { getCountryByCode, getCountriesByCodes } from '../api/countriesAPI';
import { useAuth } from '../context/AuthContext';

const CountryDetail: React.FC = () => {
  // 1. countryCode can be undefined until the router populates it
  const { countryCode } = useParams<{ countryCode?: string }>();

  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { 
    isAuthenticated, 
    isCountryFavorited, 
    addFavoriteCountry, 
    removeFavoriteCountry 
  } = useAuth();

  // 2. fetch whenever countryCode changes
  useEffect(() => {
    if (!countryCode) return;

    const fetchCountryData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getCountryByCode(countryCode);
        setCountry(data);

        if (Array.isArray(data.borders) && data.borders.length > 0) {
          const borderData = await getCountriesByCodes(data.borders);
          setBorderCountries(borderData);
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load country details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode]);

  const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

  const handleFavoriteToggle = () => {
    if (!country) return;

    if (isCountryFavorited(country.cca3)) {
      removeFavoriteCountry(country.cca3);
    } else {
      addFavoriteCountry(country.cca3);
    }
  };

  // 3. Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  // 4. Error or no-data state
  if (error || !country) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-6">{error || 'Country not found.'}</p>
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

  // 5. Safe derived values
  const safeLanguages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';

  const safeCurrencies = country.currencies
    ? Object.values(country.currencies)
        .map(c => `${c.name} (${c.symbol})`)
        .join(', ')
    : 'N/A';

  const safeTlds = country.tld?.join(', ') || 'N/A';
  const isFavorited = isCountryFavorited(country.cca3);

  return (
    <main className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleFavoriteToggle}
              className={`inline-flex items-center px-4 py-2 rounded-md shadow transition ${
                isFavorited
                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              } hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
              <Heart
                size={18}
                className="mr-2"
                fill={isFavorited ? 'currentColor' : 'none'}
              />
              {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 h-64 md:h-auto">
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

              <p>
                <strong>Official Name:</strong> {country.name.official}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Population:</strong> {formatNumber(country.population)}
                </p>
                <p>
                  <strong>Region:</strong> {country.region}
                </p>
                <p>
                  <strong>Sub Region:</strong> {country.subregion || 'N/A'}
                </p>
                <p>
                  <strong>Capital:</strong>{' '}
                  {country.capital?.join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>Languages:</strong> {safeLanguages}
                </p>
                <p>
                  <strong>Currencies:</strong> {safeCurrencies}
                </p>
                <p>
                  <strong>Top-Level Domain:</strong> {safeTlds}
                </p>
                <p>
                  <strong>Area:</strong> {formatNumber(country.area)} km²
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Border Countries */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            Border Countries:
          </h2>
          {borderCountries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {borderCountries.map((b) => (
                <Link
                  key={b.cca3}
                  to={`/country/${b.cca3}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  {b.name.common}
                </Link>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500 dark:text-gray-400">
              No bordering countries
            </p>
          )}
        </div>

        {/* External Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            More Information:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href={country.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              <ExternalLink size={16} className="mr-2" />
              Google Maps
            </a>
            <a
              href={country.maps.openStreetMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition"
            >
              <ExternalLink size={16} className="mr-2" />
              OpenStreetMap
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;
