import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/Country';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCG3ZUoZb11Mq5vkHh6An8NkRNFFr9b3Og",
  authDomain: "world-explorer-d6405.firebaseapp.com",
  projectId: "world-explorer-d6405",
  storageBucket: "world-explorer-d6405.firebasestorage.app",
  messagingSenderId: "639024035972",
  appId: "1:639024035972:web:65512de08225ce4f4faad1",
  measurementId: "G-B8MK84FQVR",
  databaseURL: "https://world-explorer-d6405-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  addFavoriteCountry: (countryCode: string) => Promise<void>;
  removeFavoriteCountry: (countryCode: string) => Promise<void>;
  isCountryFavorited: (countryCode: string) => boolean;
  saveUserData: (data: any) => Promise<void>;
  getUserData: () => Promise<any>;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  register: async () => {},
  addFavoriteCountry: async () => {},
  removeFavoriteCountry: async () => {},
  isCountryFavorited: () => false,
  saveUserData: async () => {},
  getUserData: async () => null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}
//Firebase's listener to maintain session state:
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user's data from Realtime Database
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            favoriteCountries: userData?.favoriteCountries || []
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error loading user data:', error);
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            favoriteCountries: []
          });
          setIsAuthenticated(true);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      await updateProfile(userCredential.user as FirebaseUser, {
        displayName: name
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const saveUserData = async (data: any) => {
    if (currentUser) {
      try {
        const userRef = ref(database, `users/${currentUser.id}`);
        await set(userRef, data);
      } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
      }
    }
  };

  const getUserData = async () => {
    if (currentUser) {
      try {
        const userRef = ref(database, `users/${currentUser.id}`);
        const snapshot = await get(userRef);
        return snapshot.val();
      } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
      }
    }
    return null;
  };

  const addFavoriteCountry = async (countryCode: string) => {
    if (currentUser) {
      try {
        const updatedUser = {
          ...currentUser,
          favoriteCountries: [...currentUser.favoriteCountries, countryCode]
        };
        setCurrentUser(updatedUser);
        
        // Update favorites in Realtime Database
        const userRef = ref(database, `users/${currentUser.id}/favoriteCountries`);
        await set(userRef, updatedUser.favoriteCountries);
      } catch (error) {
        console.error('Error adding favorite:', error);
        setCurrentUser(currentUser);
      }
    }
  };

  const removeFavoriteCountry = async (countryCode: string) => {
    if (currentUser) {
      try {
        const updatedUser = {
          ...currentUser,
          favoriteCountries: currentUser.favoriteCountries.filter(code => code !== countryCode)
        };
        setCurrentUser(updatedUser);
        
        // Update favorites in Realtime Database
        const userRef = ref(database, `users/${currentUser.id}/favoriteCountries`);
        await set(userRef, updatedUser.favoriteCountries);
      } catch (error) {
        console.error('Error removing favorite:', error);
        setCurrentUser(currentUser);
      }
    }
  };

  const isCountryFavorited = (countryCode: string): boolean => {
    return currentUser?.favoriteCountries.includes(countryCode) || false;
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    register,
    addFavoriteCountry,
    removeFavoriteCountry,
    isCountryFavorited,
    saveUserData,
    getUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};