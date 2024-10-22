// src/components/SearchCountry.js

import React from 'react';
import Select from 'react-select';
import {  getCode, getNames } from 'country-list';
import "./SearchCountry.css"

const SearchCountry = ({ onCountryChange }) => {
    // Generate country options
    const countryList = getNames().map((name) => ({
        label: name,
        value: getCode(name), // This gets the country code
    }));

    return (
        <div className='search'>

            <Select
                options={countryList}
                onChange={onCountryChange}
                placeholder="Select a Valid Country..     "
                isClearable
                isSearchable // Enables the search feature in the dropdown
            />
        </div>
    );
};

export default SearchCountry;


