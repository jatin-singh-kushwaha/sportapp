// src/components/Header.js

import React from 'react';
import "./Header.css";
import SearchCountry from './SearchCountry'; // Import the SearchCountry component

const Header = ({ country, countryName, onCountryChange }) => {
  return (
    <header className='header'>
     <div className='heading'> 
        <h1>Your Country: {country}</h1>
     <h2>Top Sports Streaming Websites of {countryName}:</h2>
     </div>
     <div className='placeholder'>
         {/* Include the SearchCountry component here */}
      <SearchCountry onCountryChange={onCountryChange} />
     </div>
    </header>
  );
};

export default Header;
