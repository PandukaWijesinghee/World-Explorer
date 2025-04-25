import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CountryCard from './CountryCard';

const country = {
  cca3: 'FRA',
  name: { common: 'France' },
  region: 'Europe',
  population: 67000000,
  capital: ['Paris'],
  flags: { svg: 'https://flagcdn.com/fr.svg' }
};

test('displays all info and links to detail', () => {
  render(
    <MemoryRouter>
      <CountryCard country={country} />
    </MemoryRouter>
  );

  // Name
  expect(screen.getByText('France')).toBeInTheDocument();

  

  // Match the full concatenated text of each <p>
  const byTextContent = (expected) =>
    screen.getByText((_, el) => el.textContent === expected);

  expect(byTextContent('Region: Europe')).toBeInTheDocument();
  expect(byTextContent('Population: 67,000,000')).toBeInTheDocument();
  expect(byTextContent('Capital: Paris')).toBeInTheDocument();

  // Link
  expect(screen.getByRole('link')).toHaveAttribute('href', '/country/FRA');
});
