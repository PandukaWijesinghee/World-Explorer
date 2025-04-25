import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CountryDetailPage from './pages/CountryDetailPage';
import Login from './pages/Login';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;