import { useEffect, useCallback } from 'react';
import { getName } from 'country-list';

const GettingCountry = ({ setCountry, setCountryName, country, isCountryPage }) => {
  
  const updateCountry = useCallback((countryCode) => {
    setCountry(countryCode);
    setCountryName(getName(countryCode)); 

    if (isCountryPage) { // Only set the background if it's the CountryPage
      const flagImageUrl = `https://flagcdn.com/w1600/${countryCode.toLowerCase()}.jpg`;
      document.body.style.backgroundImage = `url(${flagImageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else {
      // Reset the background if it's not the CountryPage
      document.body.style.backgroundImage = 'none';
    }
  }, [setCountry, setCountryName, isCountryPage]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const countryCode = data.country.toUpperCase(); // Ensure the country code is uppercase
       
        updateCountry(countryCode); // Use the update function here
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };
    
    fetchCountry();

    // Cleanup function
    return () => {
      document.body.style.backgroundImage = 'none'; // Reset the background image
    };
  }, [updateCountry]); 

  // Handle country change from the dropdown
  useEffect(() => {
    if (country) {
      updateCountry(country);
    }
  }, [country, updateCountry]); // Watch for changes to country

  return null; // This component does not render anything by itself
};

export default GettingCountry;
