import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './Filter';

const allCountries = [
  { region: 'Europe', languages: { fr: 'French' } },
  { region: 'Asia',   languages: { jp: 'Japanese' } }
];

test('renders two dropdowns and calls setters', () => {
  const setRegion = jest.fn(), setLanguage = jest.fn();
  render(
    <Filter
      allCountries={allCountries}
      region=""
      setRegion={setRegion}
      language=""
      setLanguage={setLanguage}
    />
  );

  const selects = screen.getAllByRole('combobox');
  expect(selects).toHaveLength(2);

  fireEvent.change(selects[0], { target: { value: 'Asia' } });
  expect(setRegion).toHaveBeenCalledWith('Asia');

  fireEvent.change(selects[1], { target: { value: 'Japanese' } });
  expect(setLanguage).toHaveBeenCalledWith('Japanese');
});
