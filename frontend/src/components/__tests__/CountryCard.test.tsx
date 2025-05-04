import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from '../CountryCard';
import { AuthProvider } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('CountryCard', () => {
  const mockCountry = {
    name: {
      common: 'United States',
      official: 'United States of America'
    },
    cca3: 'USA',
    flags: {
      svg: 'https://flagcdn.com/us.svg',
      alt: 'The flag of the United States of America'
    },
    population: 329484123,
    region: 'Americas',
    capital: ['Washington, D.C.']
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders country information in grid view', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('329,484,123')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('renders country information in list view', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="list" />);
    
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('329,484,123')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
  });

  it('shows favorite button when authenticated', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides favorite button when not authenticated', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles favorite toggle correctly', () => {
    const mockAddFavorite = vi.fn();
    const mockRemoveFavorite = vi.fn();
    
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isCountryFavorited: () => false,
      addFavoriteCountry: mockAddFavorite,
      removeFavoriteCountry: mockRemoveFavorite
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
    
    expect(mockAddFavorite).toHaveBeenCalledWith('USA');
  });

  it('shows filled heart when country is favorited', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isCountryFavorited: () => true,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    
    const heartIcon = screen.getByRole('button').querySelector('svg');
    expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500');
  });

  it('shows empty heart when country is not favorited', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={mockCountry} viewMode="grid" />);
    
    const heartIcon = screen.getByRole('button').querySelector('svg');
    expect(heartIcon).toHaveClass('text-gray-500', 'dark:text-gray-400');
  });

  it('handles missing capital data', () => {
    const countryWithoutCapital = {
      ...mockCountry,
      capital: undefined
    };

    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isCountryFavorited: () => false,
      addFavoriteCountry: vi.fn(),
      removeFavoriteCountry: vi.fn()
    });

    renderWithRouter(<CountryCard country={countryWithoutCapital} viewMode="grid" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
}); 