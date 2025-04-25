const BASE_URL = 'https://restcountries.com/v3.1';

export const fetchAllCountries = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
};

export const fetchCountryByName = async (name) => {
  const res = await fetch(`${BASE_URL}/name/${name}`);
  if (!res.ok) throw new Error('Country not found');
  return res.json();
};

export const fetchCountriesByRegion = async (region) => {
  const res = await fetch(`${BASE_URL}/region/${region}`);
  if (!res.ok) throw new Error('Region not found');
  return res.json();
};

export const fetchCountryByCode = async (code) => {
  const res = await fetch(`${BASE_URL}/alpha/${code}`);
  if (!res.ok) throw new Error('Country code not found');
  return res.json();
};