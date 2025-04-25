import React from 'react';

const Filter = ({ allCountries, region, setRegion, language, setLanguage }) => {
  const regions = [...new Set(allCountries.map(c => c.region).filter(Boolean))];
  const languages = [...new Set(allCountries.flatMap(c => Object.values(c.languages || {})))];

  return (
    <div className="flex gap-4 mb-4">
      <select value={region} onChange={e => setRegion(e.target.value)} className="p-2 border rounded">
        <option value="">All Regions</option>
        {regions.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <select value={language} onChange={e => setLanguage(e.target.value)} className="p-2 border rounded">
        <option value="">All Languages</option>
        {languages.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
};

export default Filter;