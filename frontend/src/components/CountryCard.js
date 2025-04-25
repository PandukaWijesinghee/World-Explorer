import React from 'react';
import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => (
  <Link to={`/country/${country.cca3}`}>
    <div className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
      <img src={country.flags.svg} alt={`${country.name.common} flag`} className="h-32 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold">{country.name.common}</h3>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Capital:</strong> {country.capital?.[0]}</p>
      </div>
    </div>
  </Link>
);

export default CountryCard;