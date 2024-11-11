import { useEffect, useCallback } from 'react';
import { getName } from 'country-list';

const GettingCountry = ({ setCountry, setCountryName, country, isCountryPage }) => {
  
  const updateCountry = useCallback((countryCode) => {
    setCountry(countryCode);
    setCountryName(getName(countryCode)); 

    if (isCountryPage) { 
      const flagImageUrl = `https://flagcdn.com/w1600/${countryCode.toLowerCase()}.jpg`;
      document.body.style.backgroundImage = `url(${flagImageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else {
      document.body.style.backgroundImage = 'none';
    }
  }, [setCountry, setCountryName, isCountryPage]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        console.log(data);
        const countryCode = data.country.toUpperCase(); 
       
        updateCountry(countryCode); 
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    
    fetchCountry();

   
    return () => {
      document.body.style.backgroundImage = 'none'; 
    };
  }, [updateCountry]); 

  useEffect(() => {
    if (country) {
      updateCountry(country);
    }
  }, [country, updateCountry]); 

  return null; 
};

export default GettingCountry;
