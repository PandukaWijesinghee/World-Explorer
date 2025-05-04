import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CountryDetail from '../CountryDetail';
import { getCountryByCode, getCountriesByCodes } from '../../api/countriesAPI';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API calls
vi.mock('../../api/countriesAPI', () => ({
  getCountryByCode: vi.fn(),
  getCountriesByCodes: vi.fn(),
}));

describe('CountryDetail', () => {
  const mockCountry = {
    name: {
      common: 'United States',
      official: 'United States of America',
      nativeName: {
        eng: {
          official: 'United States of America',
          common: 'United States'
        }
      }
    },
    tld: ['.us'],
    cca2: 'US',
    cca3: 'USA',
    cioc: 'USA',
    independent: true,
    status: 'officially-assigned',
    unMember: true,
    currencies: {
      USD: {
        name: 'United States dollar',
        symbol: '$'
      }
    },
    idd: {
      root: '+1',
      suffixes: ['201', '202', '203']
    },
    capital: ['Washington, D.C.'],
    altSpellings: ['US', 'USA', 'United States of America'],
    region: 'Americas',
    subregion: 'North America',
    languages: {
      eng: 'English'
    },
    translations: {
      fra: {
        official: 'Les États-Unis d\'Amérique',
        common: 'États-Unis'
      }
    },
    latlng: [38, -97],
    landlocked: false,
    borders: ['CAN', 'MEX'],
    area: 9629091,
    demonyms: {
      eng: {
        f: 'American',
        m: 'American'
      }
    },
    flag: '🇺🇸',
    maps: {
      googleMaps: 'https://goo.gl/maps/e8M246zY4BSjkjxv6',
      openStreetMaps: 'https://www.openstreetmap.org/relation/148838'
    },
    population: 329484123,
    gini: {
      '2018': 41.4
    },
    fifa: 'USA',
    car: {
      signs: ['USA'],
      side: 'right'
    },
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC+10:00', 'UTC+12:00'],
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/us.png',
      svg: 'https://flagcdn.com/us.svg',
      alt: 'The flag of the United States of America is composed of thirteen equal horizontal bands of red alternating with white. A blue rectangle, bearing fifty small five-pointed white stars arranged in nine rows where rows of six stars alternate with rows of five stars, is superimposed in the canton.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/us.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/us.svg'
    },
    startOfWeek: 'sunday',
    capitalInfo: {
      latlng: [38.89, -77.05]
    },
    postalCode: {
      format: '#####-####',
      regex: '^(\\d{9})$'
    }
  };

  const mockBorderCountries = [
    {
      name: { common: 'Canada' },
      cca2: 'CAN',
      flags: { png: 'https://flagcdn.com/w320/ca.png' }
    },
    {
      name: { common: 'Mexico' },
      cca2: 'MEX',
      flags: { png: 'https://flagcdn.com/w320/mx.png' }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getCountryByCode as jest.Mock).mockResolvedValue(mockCountry);
    (getCountriesByCodes as jest.Mock).mockResolvedValue(mockBorderCountries);
  });

  const renderWithRouter = (ui: React.ReactElement, { route = '/country/US' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/country/:countryCode" element={ui} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders loading state initially', () => {
    (getCountryByCode as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<CountryDetail />);
    expect(screen.getByText('Loading country details...')).toBeInTheDocument();
  });

  it('displays country details when data is loaded', async () => {
    renderWithRouter(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
      expect(screen.getByText('Americas')).toBeInTheDocument();
      expect(screen.getByText('329,484,123')).toBeInTheDocument();
    });
  });

  it('displays border countries when available', async () => {
    renderWithRouter(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });

  it('displays error message when country data fetch fails', async () => {
    (getCountryByCode as jest.Mock).mockRejectedValue(new Error('API Error'));
    renderWithRouter(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch country details. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays error message when border countries fetch fails', async () => {
    (getCountriesByCodes as jest.Mock).mockRejectedValue(new Error('API Error'));
    renderWithRouter(<CountryDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    });
  });
}); 