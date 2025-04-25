import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const TestComp = () => {
  const { user, login, logout } = useAuth();
  return (
    <>
      <span>{user ? user.username : 'no user'}</span>
      <button onClick={() => login('alice', 'pwd')}>Log In</button>
      <button onClick={logout}>Log Out</button>
    </>
  );
};

test('login sets user and logout clears it', () => {
  render(
    <AuthProvider>
      <TestComp />
    </AuthProvider>
  );
  expect(screen.getByText('no user')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Log In'));
  expect(screen.getByText('alice')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Log Out'));
  expect(screen.getByText('no user')).toBeInTheDocument();
});
