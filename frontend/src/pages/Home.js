import React from 'react';
import { useCountries } from '../hooks/useCountries';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import CountryCard from '../components/CountryCard';

const Home = () => {
  const { countries, search, setSearch, region, setRegion, language, setLanguage, allCountries } = useCountries();

  return (
    <>
      <SearchBar search={search} setSearch={setSearch} />
      <Filter allCountries={allCountries} region={region} setRegion={setRegion} language={language} setLanguage={setLanguage} />
      {countries.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map(c => <CountryCard key={c.cca3} country={c} />)}
        </div>
      ) : (
        <p>No countries match your criteria.</p>
      )}
    </>
  );
};

export default Home;