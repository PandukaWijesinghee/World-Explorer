import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCountryByCode } from '../services/api';

const CountryDetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetchCountryByCode(code)
      .then(data => setCountry(data[0]))
      .catch(console.error);
  }, [code]);

  if (!country) return <p>Loading...</p>;

  const languages = Object.values(country.languages || {});

  return (
    <div className="bg-white p-6 rounded shadow">
      <Link to="/" className="text-blue-500">← Back</Link>
      <h2 className="text-2xl font-bold my-4">{country.name.common}</h2>
      <img src={country.flags.svg} alt="flag" className="w-64 mb-4" />
      <p><strong>Capital:</strong> {country.capital?.[0]}</p>
      <p><strong>Region:</strong> {country.region}</p>
      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> {languages.join(', ')}</p>
    </div>
  );
};

export default CountryDetailPage;