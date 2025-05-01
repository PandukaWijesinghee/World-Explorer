import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './utils/App.tsx';
import './index.css';
import ResourceLoader from './components/ResourceLoader';

// Initialize localStorage if necessary
if (typeof localStorage !== 'undefined') {
  // Check if users already exist in localStorage
  const users = localStorage.getItem('users');
  if (!users) {
    localStorage.setItem('users', JSON.stringify([]));
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResourceLoader>
      <App />
    </ResourceLoader>
  </StrictMode>
);