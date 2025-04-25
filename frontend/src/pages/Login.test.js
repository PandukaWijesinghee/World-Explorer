import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// stub out useNavigate so we can ignore routing
jest.mock('react-router-dom', () => {
  const orig = jest.requireActual('react-router-dom');
  return { ...orig, useNavigate: () => () => {} };
});

test('submits username/password and stores user', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );

  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(JSON.parse(localStorage.getItem('user'))).toEqual({ username: 'bob' });
});
