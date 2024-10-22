import React from 'react';
import { Link } from 'react-router-dom';
import {  Typography, Button } from '@mui/material';

const Header = ({ countryCode }) => {
  return (
    
    <div  position="static">
      <header className="flex bg-red-950  text-white justify-between items-center  top-0 left-0 right-0 z-10 p-4 ">
        <Typography   variant="h4" className="font-bold text-red-500" component="div" sx={{ flexGrow: 1 }}>
          Sports Hub
        </Typography>

        <div className="text-2xl flex space-x-4">
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/sports">
            Sports
          </Button>
          <Button color="inherit" component={Link} to={`/country/${countryCode}`}>
            Country
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
