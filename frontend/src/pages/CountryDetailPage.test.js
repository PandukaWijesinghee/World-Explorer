
jest.mock('../services/api', () => ({
  fetchCountryByCode: jest.fn()

  //Mock the API module before any imports
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { fetchCountryByCode } from '../services/api';
import CountryDetailPage from './CountryDetailPage';

// Prepare our fake data
const mockCountryData = [{
  name: { common: 'Testland' },
  capital: ['Testcity'],
  region: 'TestRegion',
  population: 123456,
  languages: { en: 'English' },
  flags: { svg: 'flag.svg' }
}];

// Helper to get by exact textContent
const getByTextExact = (text) =>
  screen.getByText((_, el) => el.textContent === text);

beforeEach(() => {
  fetchCountryByCode.mockClear();
  fetchCountryByCode.mockResolvedValue(mockCountryData);
});

test('loads and displays country details', async () => {
  render(
    <MemoryRouter initialEntries={['/country/TST']}>
      <Routes>
        <Route path="/country/:code" element={<CountryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for name
  const nameEl = await screen.findByText('Testland');
  expect(nameEl).toBeInTheDocument();

  // Now assert each <p> by exact textContent
  expect(getByTextExact('Capital: Testcity')).toBeInTheDocument();
  expect(getByTextExact('Region: TestRegion')).toBeInTheDocument();
  expect(getByTextExact('Population: 123,456')).toBeInTheDocument();
  expect(getByTextExact('Languages: English')).toBeInTheDocument();
});
