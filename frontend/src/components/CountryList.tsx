import { useEffect, useState } from 'react';
import CountryCard from './CountryCard';
import { Country } from '../types/Country';
import { Filter, X, Grid, List, ArrowUpDown } from 'lucide-react';

interface CountryListProps {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

type SortField = 'name' | 'population' | 'area';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const CountryList = ({ countries, isLoading, error }: CountryListProps) => {
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
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

  // Extract unique regions and languages
  const regions = [...new Set(countries.map(country => country.region))].sort();
  const allLanguages = countries.reduce((acc, country) => {
    const langs = country.languages ? Object.values(country.languages) : [];
    return [...acc, ...langs];
  }, [] as string[]);
  const languages = [...new Set(allLanguages)].sort();

  // Calculate statistics
  const totalPopulation = filteredCountries.reduce((sum, country) => sum + country.population, 0);
  const averageArea = filteredCountries.length > 0 
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

  // Update filtered countries when source data or filters change
  useEffect(() => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'Country' : 'Countries'} Found
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search countries..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Total Countries</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredCountries.length}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Total Population</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {new Intl.NumberFormat().format(totalPopulation)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Average Area</h3>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {new Intl.NumberFormat().format(Math.round(averageArea))} km²
            </p>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filter Countries</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          
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

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => toggleSort('name')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              sortField === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Name
            {sortField === 'name' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
          </button>
          <button
            onClick={() => toggleSort('population')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              sortField === 'population' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Population
            {sortField === 'population' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
          </button>
          <button
            onClick={() => toggleSort('area')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              sortField === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Area
            {sortField === 'area' && <ArrowUpDown size={16} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
          </button>
        </div>
      </div>
      
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
          : 'flex flex-col gap-4'
        }
      `}>
        {filteredCountries.map(country => (
          <CountryCard 
            key={country.cca3} 
            country={country}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default CountryList;