import { useEffect, useState } from 'react';
import CountryCard from './CountryCard';
import { Country } from '../types/Country';
import { Sun, Moon, Globe, BarChart2, Map, Filter, X, Grid, List, ArrowUpDown, Search, Settings } from 'lucide-react';

interface CountryListProps {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

type SortField = 'name' | 'population' | 'area';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const CountryList = ({ countries = [], isLoading, error }: CountryListProps) => {
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState({
    region: '',
    population: '',
    language: '',
    search: ''
  });

  // Update filtered countries when source data or filters change
  useEffect(() => {
    if (!Array.isArray(countries)) {
      setFilteredCountries([]);
      return;
    }

    let result = [...countries];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm) ||
        country.name.official.toLowerCase().includes(searchTerm)
      );
    }

    // Apply region filter
    if (filters.region) {
      result = result.filter(country => country.region === filters.region);
    }
    
    // Apply population filter
    if (filters.population) {
      switch (filters.population) {
        case 'small':
          result = result.filter(country => country.population < 1000000);
          break;
        case 'medium':
          result = result.filter(country => country.population >= 1000000 && country.population < 10000000);
          break;
        case 'large':
          result = result.filter(country => country.population >= 10000000 && country.population < 100000000);
          break;
        case 'extraLarge':
          result = result.filter(country => country.population >= 100000000);
          break;
      }
    }
    
    // Apply language filter
    if (filters.language) {
      result = result.filter(country => {
        if (!country.languages) return false;
        return Object.values(country.languages).includes(filters.language);
      });
    }

    // Apply sorting
    result.sort(sortCountries);
    
    setFilteredCountries(result);
  }, [countries, filters, sortField, sortOrder]);

  // Extract unique regions and languages
  const regions = Array.isArray(countries) 
    ? [...new Set(countries.map(country => country.region))].sort()
    : [];

  const allLanguages = Array.isArray(countries)
    ? countries.reduce((acc, country) => {
        const langs = country.languages ? Object.values(country.languages) : [];
        return [...acc, ...langs];
      }, [] as string[])
    : [];

  const languages = [...new Set(allLanguages)].sort();

  // Calculate statistics
  const totalPopulation = Array.isArray(filteredCountries)
    ? filteredCountries.reduce((sum, country) => sum + country.population, 0)
    : 0;

  const averageArea = Array.isArray(filteredCountries) && filteredCountries.length > 0
    ? filteredCountries.reduce((sum, country) => sum + country.area, 0) / filteredCountries.length
    : 0;

  // Sort function
  const sortCountries = (a: Country, b: Country) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.common.localeCompare(b.name.common);
        break;
      case 'population':
        comparison = a.population - b.population;
        break;
      case 'area':
        comparison = a.area - b.area;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  };

  const resetFilters = () => {
    setFilters({
      region: '',
      population: '',
      language: '',
      search: ''
    });
    setSortField('name');
    setSortOrder('asc');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (filteredCountries.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">No countries found matching your criteria</p>
        {(filters.region || filters.population || filters.language || filters.search) && (
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
             {/*  <Globe className="w-8 h-8 text-primary-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                World Explorer
             </h1> */}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="input-field pl-10 pr-4 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary-500 text-white shadow-glow' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary-500 text-white shadow-glow' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Countries</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{filteredCountries.length}</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
              <BarChart2 className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Population</p>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {new Intl.NumberFormat().format(totalPopulation)}
              </p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <Map className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Area</p>
              <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {new Intl.NumberFormat().format(Math.round(averageArea))} km²
              </p>
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Settings className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Filters</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Object.values(filters).filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sort Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Filter size={18} />
                  <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                </button>
              </div>
              
              {showFilters && (
                <div className="animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Region
                      </label>
                      <select
                        value={filters.region}
                        onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">All Regions</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Population
                      </label>
                      <select
                        value={filters.population}
                        onChange={(e) => setFilters(prev => ({ ...prev, population: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">Any Population</option>
                        <option value="small">Small (&lt; 1M)</option>
                        <option value="medium">Medium (1M - 10M)</option>
                        <option value="large">Large (10M - 100M)</option>
                        <option value="extraLarge">Extra Large (&gt; 100M)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        value={filters.language}
                        onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">All Languages</option>
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sort By</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleSort('name')}
                  className={`btn-primary flex items-center justify-between ${
                    sortField === 'name' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>Name</span>
                  {sortField === 'name' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </button>
                <button
                  onClick={() => toggleSort('population')}
                  className={`btn-primary flex items-center justify-between ${
                    sortField === 'population' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>Population</span>
                  {sortField === 'population' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </button>
                <button
                  onClick={() => toggleSort('area')}
                  className={`btn-primary flex items-center justify-between ${
                    sortField === 'area' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>Area</span>
                  {sortField === 'area' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Country Grid/List */}
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
            : 'flex flex-col gap-6'
          }
        `}>
          {filteredCountries.map((country, index) => (
            <div key={country.cca3} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <CountryCard 
                country={country}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CountryList;