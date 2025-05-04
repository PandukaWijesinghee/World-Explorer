import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../HomePage';
import { getAllCountries } from '../../api/countriesAPI';

// Mock the API call
vi.mock('../../api/countriesAPI', () => ({
  getAllCountries: vi.fn(),
}));

describe('HomePage', () => {
  const mockCountries = [
    {
      name: { common: 'United States' },
      cca2: 'US',
      flags: { png: 'https://flagcdn.com/w320/us.png' },
      population: 329484123,
      region: 'Americas',
      capital: ['Washington, D.C.'],
    },
    {
      name: { common: 'France' },
      cca2: 'FR',
      flags: { png: 'https://flagcdn.com/w320/fr.png' },
      population: 67391582,
      region: 'Europe',
      capital: ['Paris'],
    },
  ];

  it('renders loading state initially', () => {
    (getAllCountries as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<HomePage />);
    expect(screen.getByText('Loading countries...')).toBeInTheDocument();
  });

  it('displays countries when data is loaded', async () => {
    (getAllCountries as jest.Mock).mockResolvedValue(mockCountries);
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    (getAllCountries as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch countries. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays error message when no countries are returned', async () => {
    (getAllCountries as jest.Mock).mockResolvedValue([]);
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('No countries data available. Please try again later.')).toBeInTheDocument();
    });
  });
}); 