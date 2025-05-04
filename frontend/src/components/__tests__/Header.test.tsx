import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthProvider } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Header', () => {
  const mockToggleDarkMode = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      currentUser: null,
      logout: vi.fn(),
    });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renders header with logo and search bar', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    expect(screen.getByText('World Explorer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Add your Favorites Here')).toBeInTheDocument();
  });

  it('shows user info and logout button when authenticated', () => {
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Test User' },
      logout: vi.fn(),
    });

    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('handles search form submission', () => {
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);

    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'United States' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=United%20States');
  });

  it('handles dark mode toggle', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    const darkModeButton = screen.getByLabelText('Toggle dark mode');
    fireEvent.click(darkModeButton);
    
    expect(mockToggleDarkMode).toHaveBeenCalled();
  });

  it('shows moon icon in light mode', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('shows sun icon in dark mode', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={true} />);
    
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('handles logout', () => {
    const mockLogout = vi.fn();
    const { useAuth } = require('../../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Test User' },
      logout: mockLogout,
    });

    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows mobile dark mode toggle', () => {
    renderWithRouter(<Header toggleDarkMode={mockToggleDarkMode} isDarkMode={false} />);
    
    const mobileDarkModeButton = screen.getByLabelText('Toggle dark mode');
    expect(mobileDarkModeButton).toBeInTheDocument();
  });
}); 