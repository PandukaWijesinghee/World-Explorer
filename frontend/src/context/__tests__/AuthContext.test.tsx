import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Mock Firebase functions
vi.mock('firebase/auth');
vi.mock('firebase/firestore');

describe('AuthContext', () => {
  const mockUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  const mockUserData = {
    favoriteCountries: ['US', 'FR'],
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    (getAuth as jest.Mock).mockReturnValue({});
    (getFirestore as jest.Mock).mockReturnValue({});
    (getDoc as jest.Mock).mockResolvedValue({ data: () => mockUserData });
    (setDoc as jest.Mock).mockResolvedValue(undefined);
  });

  const TestComponent = () => {
    const { currentUser, isAuthenticated, login, register, addFavoriteCountry, removeFavoriteCountry } = useAuth();
    
    return (
      <div>
        <div data-testid="user">{currentUser?.name}</div>
        <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
        <button onClick={() => register('test@example.com', 'Test User', 'password')}>Register</button>
        <button onClick={() => addFavoriteCountry('US')}>Add Favorite</button>
        <button onClick={() => removeFavoriteCountry('US')}>Remove Favorite</button>
      </div>
    );
  };

  it('provides initial state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });

  it('handles login successfully', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password');
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
  });

  it('handles registration successfully', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
    (updateProfile as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'password'
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: 'Test User'
    });
  });

  it('handles adding and removing favorites', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Add Favorite').click();
    });

    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        favoriteCountries: expect.arrayContaining(['US'])
      })
    );

    await act(async () => {
      screen.getByText('Remove Favorite').click();
    });

    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        favoriteCountries: expect.not.arrayContaining(['US'])
      })
    );
  });

  it('handles logout', async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
  });
}); 