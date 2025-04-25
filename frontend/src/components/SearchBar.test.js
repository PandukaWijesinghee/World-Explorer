import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders input and calls setSearch on change', () => {
  const setSearch = jest.fn();
  render(<SearchBar search="" setSearch={setSearch} />);
  const input = screen.getByPlaceholderText(/search countries/i);
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'France' } });
  expect(setSearch).toHaveBeenCalledWith('France');
});
