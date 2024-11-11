import React, { useState } from 'react';
import {  IconButton, Button, FormControl, Select, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import the MenuIcon
import Sidebar from './Sidebar'; // Assuming you create a separate Sidebar component

const Header = ({ 
  handleExploreSports, 
  handleExploreCountries, 
  setSearchDialogOpen, 
  availableLanguages, 
  language, 
  handleLanguageChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="flex md:flex-row justify-between bg-transparent text-white items-center fixed top-0 left-0 right-0 z-10 p-1 md:p-4">
        
        {/* Menu Icon for smaller screens (left side) */}
        <div className="flex md:hidden p-0">
          <IconButton onClick={toggleSidebar} color="inherit">
            <MenuIcon fontSize="large" /> {/* The MenuIcon ( = icon ) */}
          </IconButton>
        </div>

        {/* Title (Sports App) */}
        <img 
          src="/favicon.ico" 
          alt="Sports App Logo" 
          className="h-12 w-auto"
        />

        {/* Button group for larger screens */}
        <div className="hidden md:flex text-2xl flex-row md:space-x-4">
          <Button variant='secondary' onClick={handleExploreSports}>
            Explore Sports
          </Button>
          <Button variant='secondary' onClick={() => setSearchDialogOpen(true)}>
            Search Countries & Sports
          </Button>
          <Button variant='secondary' onClick={handleExploreCountries}>
            Explore Countries
          </Button>
        </div>

        {/* Language Selector for all screens */}
        <FormControl className="mt-2 md:mt-0 " sx={{ minWidth: 100 }}>
  <Select
    value={language}
    onChange={handleLanguageChange}
    size="small" // Set size to 'small'
    sx={{
      bgcolor: 'white',
      color: 'black',
      '& .MuiSelect-icon': {
        color: 'black',
      },
      '& .MuiMenuItem-root': {
        bgcolor: 'white',
        color: 'black',
        '&:hover': {
          bgcolor: '#f0f0f0',
        },
      },
    }}
  >
    {availableLanguages.map(lang => (
      <MenuItem key={lang.code} value={lang.code}>
        {lang.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      </header>

      <Sidebar
        open={sidebarOpen}
        onClose={toggleSidebar}
        handleExploreSports={handleExploreSports}
        handleExploreCountries={handleExploreCountries}
        setSearchDialogOpen={setSearchDialogOpen}
      />
    </>
  );
};

export default Header;
