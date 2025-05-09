import axios from 'axios';
import { Country } from '../types/Country';
import { fallbackCountries } from './fallbackData';

const API_BASE_URL = 'https://restcountries.com/v3.1';

// Helper function to validate country data
const isValidCountry = (data: any): data is Country => {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(country => 
      country &&
      typeof country === 'object' &&
      'name' in country &&
      'cca3' in country &&
      'population' in country
    )
  );
};

// Get all countries with essential fields
export const getAllCountries = async (): Promise<Country[]> => {
  try {
    console.log('Fetching countries from:', `${API_BASE_URL}/all`);
    const response = await axios.get<Country[]>(`${API_BASE_URL}/all`, {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    });
    
    if (isValidCountry(response.data)) {
      console.log('Countries fetched successfully:', response.data.length);
      return response.data;
    } else {
      console.error('Invalid response data format');
      return fallbackCountries;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else {
      console.error('Error fetching all countries:', error);
    }
    console.log('Using fallback countries data');
    return fallbackCountries;
  }
};

// Search countries by name
export const searchCountriesByName = async (name: string): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/name/${name}`);
    return isValidCountry(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Error searching countries by name:', error);
    return fallbackCountries.filter(country => 
      country.name.common.toLowerCase().includes(name.toLowerCase()) ||
      country.name.official.toLowerCase().includes(name.toLowerCase())
    );
  }
};

// Get countries by region
export const getCountriesByRegion = async (region: string): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/region/${region}`);
    return isValidCountry(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    return fallbackCountries.filter(country => 
      country.region.toLowerCase() === region.toLowerCase()
    );
  }
};

// Get country details by code
export const getCountryByCode = async (code: string): Promise<Country> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/alpha/${code}`);
    if (isValidCountry(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error('Invalid country data received');
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    const country = fallbackCountries.find(c => 
      c.cca2 === code || c.cca3 === code || c.cioc === code
    );
    if (country) {
      return country;
    }
    throw new Error(`Country with code ${code} not found`);
  }
};

// Get multiple countries by codes (for border countries)
export const getCountriesByCodes = async (codes: string[]): Promise<Country[]> => {
  if (!codes.length) return [];
  
  try {
    const codesParam = codes.join(',');
    const response = await axios.get<Country[]>(`${API_BASE_URL}/alpha?codes=${codesParam}`);
    return isValidCountry(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching countries by codes:', error);
    return fallbackCountries.filter(country => 
      codes.includes(country.cca2) || codes.includes(country.cca3) || codes.includes(country.cioc)
    );
  }
};