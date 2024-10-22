import React, { useState } from 'react';
import GettingCountry from './countryRoute/GettingCountry';
import GettingSite from './countryRoute/GettingSite';
import Cards from './countryRoute/Cards';
import Header from './countryRoute/Header';
import './CountryPage.css'; 

import { getName } from 'country-list';

const CountryPage = () => {
  const [country, setCountry] = useState('');
  const [countryName, setCountryName] = useState('');
  const [streamingSites, setStreamingSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle country change function
  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      const countryCode = selectedOption.value;
      setCountry(countryCode);
      setCountryName(getName(countryCode)); // Convert country code to name
    }
  };

  return (
    <>
      <Header country={country} countryName={countryName} onCountryChange={handleCountryChange} />
      <GettingCountry setCountry={setCountry} setCountryName={setCountryName} country={country} isCountryPage={true} />
      <GettingSite country={country} setStreamingSites={setStreamingSites} setLoading={setLoading} />
      <Cards streamingSites={streamingSites} loading={loading} />
    </>
  );
};

export default CountryPage;
