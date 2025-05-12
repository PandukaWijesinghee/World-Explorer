import axios from 'axios';
import { Country } from '../types/Country';
import fallbackCountries from './fallbackData';

const API_BASE_URL = '/api';

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
    
    // Ensure we have an array of countries
    const countries = Array.isArray(response.data) ? response.data : [];
    console.log('Countries fetched successfully:', countries.length);
    
    if (countries.length === 0) {
      console.log('No countries returned from API, using fallback data');
      return fallbackCountries;
    }
    
    return countries;
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
    // Return fallback data instead of empty array
    console.log('Using fallback countries data');
    return fallbackCountries;
  }
};

// Search countries by name
export const searchCountriesByName = async (name: string): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/name/${name}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    // If no countries found, return empty array instead of throwing error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Error searching countries by name:', error);
    // Use fallback data and filter it
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
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    // Use fallback data and filter it
    return fallbackCountries.filter(country => 
      country.region.toLowerCase() === region.toLowerCase()
    );
  }
};

// Get country details by code
export const getCountryByCode = async (code: string): Promise<Country> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/alpha/${code}`);
    const countries = Array.isArray(response.data) ? response.data : [];
    if (countries.length === 0) {
      throw new Error(`Country with code ${code} not found`);
    }
    return countries[0];
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    // Use fallback data and find the country
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
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching countries by codes:', error);
    // Use fallback data and filter it
    return fallbackCountries.filter(country => 
      codes.includes(country.cca2) || codes.includes(country.cca3) || codes.includes(country.cioc)
    );
  }
};