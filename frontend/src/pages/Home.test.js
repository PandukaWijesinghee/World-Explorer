import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import * as useCountriesHook from '../hooks/useCountries';

// stub out CountryCard so we just count its renderings
jest.mock('../components/CountryCard', () => () => <div data-testid="card">Card</div>);

describe('Home', () => {
  it('renders one CountryCard per country from useCountries', () => {
    jest.spyOn(useCountriesHook, 'useCountries').mockReturnValue({
      countries: [{ cca3: 'USA' }, { cca3: 'CAN' }],
      search: '',
      setSearch: jest.fn(),
      region: '',
      setRegion: jest.fn(),
      language: '',
      setLanguage: jest.fn(),
      allCountries: []
    });

    render(<Home />);
    expect(screen.getAllByTestId('card')).toHaveLength(2);
  });
});
