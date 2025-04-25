import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">Countries Explorer</Link>
        <nav>
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          ) : (
            <Link to="/login" className="bg-blue-500 text-white px-3 py-1 rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;