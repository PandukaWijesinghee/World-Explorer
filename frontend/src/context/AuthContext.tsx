import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/Country';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  addFavoriteCountry: (countryCode: string) => void;
  removeFavoriteCountry: (countryCode: string) => void;
  isCountryFavorited: (countryCode: string) => boolean;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  addFavoriteCountry: () => {},
  removeFavoriteCountry: () => {},
  isCountryFavorited: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// This would normally interact with a backend API
// For demo purposes, using localStorage
const fakeUserApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);
        
        if (user && user.password === password) {
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },
  
  register: async (email: string, name: string, password: string): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some((u: any) => u.email === email)) {
          reject(new Error('Email already in use'));
          return;
        }
        
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name,
          password, // In a real app, never store passwords in plain text
          favoriteCountries: []
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const { password: _, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }, 500);
    });
  },
  
  updateFavorites: async (userId: string, favorites: string[]): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].favoriteCountries = favorites;
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        resolve();
      }, 200);
    });
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAuthenticated = !!currentUser;
  
  // Initialize auth state from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const user = await fakeUserApi.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  const register = async (email: string, name: string, password: string) => {
    try {
      const user = await fakeUserApi.register(email, name, password);
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };
  
  const addFavoriteCountry = (countryCode: string) => {
    if (!currentUser) return;
    
    const updatedFavorites = [...currentUser.favoriteCountries, countryCode];
    const updatedUser = { ...currentUser, favoriteCountries: updatedFavorites };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    fakeUserApi.updateFavorites(currentUser.id, updatedFavorites);
  };
  
  const removeFavoriteCountry = (countryCode: string) => {
    if (!currentUser) return;
    
    const updatedFavorites = currentUser.favoriteCountries.filter(
      code => code !== countryCode
    );
    const updatedUser = { ...currentUser, favoriteCountries: updatedFavorites };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    fakeUserApi.updateFavorites(currentUser.id, updatedFavorites);
  };
  
  const isCountryFavorited = (countryCode: string): boolean => {
    return currentUser ? currentUser.favoriteCountries.includes(countryCode) : false;
  };
  
  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register,
    addFavoriteCountry,
    removeFavoriteCountry,
    isCountryFavorited
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};