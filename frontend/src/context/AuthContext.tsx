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
import { getFirestore, doc, setDoc, getDoc, updateDoc, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCG3ZUoZb11Mq5vkHh6An8NkRNFFr9b3Og",
  authDomain: "world-explorer-d6405.firebaseapp.com",
  projectId: "world-explorer-d6405",
  storageBucket: "world-explorer-d6405.firebasestorage.app",
  messagingSenderId: "639024035972",
  appId: "1:639024035972:web:65512de08225ce4f4faad1",
  measurementId: "G-B8MK84FQVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
  loginWithGoogle: async () => {},
  logout: () => {},
  register: async () => {},
  addFavoriteCountry: () => {},
  removeFavoriteCountry: () => {},
  isCountryFavorited: () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user's favorites from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            favoriteCountries: userData?.favoriteCountries || []
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error loading user data:', error);
          // Initialize with empty favorites if there's an error
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

  const addFavoriteCountry = async (countryCode: string) => {
    if (currentUser) {
      try {
        const updatedUser = {
          ...currentUser,
          favoriteCountries: [...currentUser.favoriteCountries, countryCode]
        };
        setCurrentUser(updatedUser);
        
        // Update favorites in Firestore
        await setDoc(doc(db, 'users', currentUser.id), {
          favoriteCountries: updatedUser.favoriteCountries
        }, { merge: true });
      } catch (error) {
        console.error('Error adding favorite:', error);
        // Revert the local state if Firestore update fails
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
        
        // Update favorites in Firestore
        await setDoc(doc(db, 'users', currentUser.id), {
          favoriteCountries: updatedUser.favoriteCountries
        }, { merge: true });
      } catch (error) {
        console.error('Error removing favorite:', error);
        // Revert the local state if Firestore update fails
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
    isCountryFavorited
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};