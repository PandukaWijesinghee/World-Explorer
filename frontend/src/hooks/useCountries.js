import { useState, useEffect } from 'react';
import { fetchAllCountries } from '../services/api';

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    fetchAllCountries()
      .then(data => { setCountries(data); setFiltered(data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let data = countries;
    if (search) data = data.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()));
    if (region) data = data.filter(c => c.region === region);
    if (language) data = data.filter(c => Object.values(c.languages || {}).includes(language));
    setFiltered(data);
  }, [search, region, language, countries]);

  return { countries: filtered, search, setSearch, region, setRegion, language, setLanguage, allCountries: countries };
};