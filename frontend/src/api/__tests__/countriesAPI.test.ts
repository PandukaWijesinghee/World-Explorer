import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getAllCountries, searchCountriesByName, getCountriesByRegion, getCountryByCode, getCountriesByCodes } from '../countriesAPI';
import fallbackCountries from '../fallbackData';

// Mock axios
vi.mock('axios');

describe('countriesAPI', () => {
  const mockCountries = [
    {
      name: { common: 'United States', official: 'United States of America' },
      cca2: 'US',
      cca3: 'USA',
      cioc: 'USA',
      flags: { png: 'https://flagcdn.com/w320/us.png' },
      population: 329484123,
      region: 'Americas',
      capital: ['Washington, D.C.'],
    },
    {
      name: { common: 'France', official: 'French Republic' },
      cca2: 'FR',
      cca3: 'FRA',
      cioc: 'FRA',
      flags: { png: 'https://flagcdn.com/w320/fr.png' },
      population: 67391582,
      region: 'Europe',
      capital: ['Paris'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCountries', () => {
    it('should return countries when API call is successful', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });
      const result = await getAllCountries();
      expect(result).toEqual(mockCountries);
      expect(axios.get).toHaveBeenCalledWith('/api/all', expect.any(Object));
    });

    it('should return fallback data when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const result = await getAllCountries();
      expect(result).toEqual(fallbackCountries);
    });
  });

  describe('searchCountriesByName', () => {
    it('should return matching countries when API call is successful', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockCountries[0]] });
      const result = await searchCountriesByName('United');
      expect(result).toEqual([mockCountries[0]]);
      expect(axios.get).toHaveBeenCalledWith('/api/name/United');
    });

    it('should return empty array when no countries found', async () => {
      (axios.get as jest.Mock).mockRejectedValue({ response: { status: 404 } });
      const result = await searchCountriesByName('Nonexistent');
      expect(result).toEqual([]);
    });

    it('should use fallback data when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const result = await searchCountriesByName('United');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name.common.toLowerCase()).toContain('united');
    });
  });

  describe('getCountriesByRegion', () => {
    it('should return countries in the specified region', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockCountries[0]] });
      const result = await getCountriesByRegion('Americas');
      expect(result).toEqual([mockCountries[0]]);
      expect(axios.get).toHaveBeenCalledWith('/api/region/Americas');
    });

    it('should use fallback data when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const result = await getCountriesByRegion('Americas');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].region.toLowerCase()).toBe('americas');
    });
  });

  describe('getCountryByCode', () => {
    it('should return country by code', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [mockCountries[0]] });
      const result = await getCountryByCode('US');
      expect(result).toEqual(mockCountries[0]);
      expect(axios.get).toHaveBeenCalledWith('/api/alpha/US');
    });

    it('should use fallback data when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const result = await getCountryByCode('US');
      expect(result).toEqual(expect.objectContaining({ cca2: 'US' }));
    });

    it('should throw error when country not found in fallback data', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      await expect(getCountryByCode('XX')).rejects.toThrow('Country with code XX not found');
    });
  });

  describe('getCountriesByCodes', () => {
    it('should return countries by codes', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });
      const result = await getCountriesByCodes(['US', 'FR']);
      expect(result).toEqual(mockCountries);
      expect(axios.get).toHaveBeenCalledWith('/api/alpha?codes=US,FR');
    });

    it('should return empty array when no codes provided', async () => {
      const result = await getCountriesByCodes([]);
      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should use fallback data when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      const result = await getCountriesByCodes(['US', 'FR']);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(expect.objectContaining({ cca2: expect.any(String) }));
    });
  });
}); 