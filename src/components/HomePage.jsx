import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Checkbox, ListItemText, IconButton, Typography, FormControl, Select, MenuItem } from '@mui/material'; 
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { countries } from 'countries-list';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Header from './Header'; // Import the Header component
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component

const languageOptions = { 
  IN: {
    en: 'English',
    hi: 'हिंदी',
  },
  US: {
    en: 'English',
    es: 'Español',
  },
};

const HomePage = ({ countryCode }) => {
  const navigate = useNavigate();
  const [searchTerms, setSearchTerms] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsData, setSportsData] = useState([]); 
  const [userLocation, setUserLocation] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        const data = response.data;
        setUserLocation(data.country_name || countryCode);
        setAvailableLanguages(Object.entries(languageOptions[countryCode] || {}).map(([key, value]) => ({
          code: key,
          name: value,
        })));
      } catch (error) {
        console.error('Error fetching location:', error);
        setUserLocation(countryCode);
        setAvailableLanguages(Object.entries(languageOptions['US']).map(([key, value]) => ({
          code: key,
          name: value,
        })));
      }
    };

    fetchLocation();
  }, [countryCode]);

  
  useEffect(() => {
    const fetchSportsData = async () => {
      const db = getFirestore(); // Initialize Firestore
      const sportsCollection = collection(db, 'sports'); // Reference to 'sports' collection
      const sportsSnapshot = await getDocs(sportsCollection); // Fetch all docs in 'sports' collection
      const sportsList = sportsSnapshot.docs.map(doc => doc.data()); // Map documents to data array
      setSportsData(sportsList); // Store Firebase data in state
    };

    fetchSportsData();
  }, []);

  const handleExploreSports = () => {
    navigate('/sports');
  };

  const handleExploreCountries = () => {
    navigate(`/country/${countryCode}`);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialogOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchParam = searchTerms.trim().toLowerCase(); // Convert to lowercase

    // Navigate directly to the /sports/{searchresult} route
    navigate(`/sports/${searchParam}`);
  };

  const handleSportSubmit = (e) => {
    e.preventDefault();
    const countriesParam = selectedCountries.length ? selectedCountries.join(',') : '';
    const sportsParam = selectedSports.length ? selectedSports.join(',') : '';

    // Navigate to the search result page with selected countries and sports
    navigate(`/searchresult?countries=${countriesParam}&sports=${sportsParam}`);
    setSearchDialogOpen(false);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    localStorage.setItem('preferredLanguage', event.target.value);
  };

  return (
    <section
      className="bg-cover bg-center min-h-screen flex flex-col justify-center"
      style={{
        backgroundImage: "url('/newbg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Updated Header with Sidebar */}
      <Header 
        countryCode={countryCode}
        language={language}
        availableLanguages={availableLanguages}
        handleExploreSports={handleExploreSports}
        handleExploreCountries={handleExploreCountries}
        setSearchDialogOpen={setSearchDialogOpen}
        setSidebarOpen={setSidebarOpen} // Pass the function to open the sidebar
      />
      
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} handleExploreSports={handleExploreSports} handleExploreCountries={handleExploreCountries} setSearchDialogOpen={setSearchDialogOpen} />

      <div className="max-w-5xl mx-auto px-4 py-8 bg-transparent bg-opacity-80 p-6 rounded-lg shadow-lg mt-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:w-full text-center">
            <h1 className="text-7xl font-bold mb-4 text-white">
              Discover Sports in {userLocation}
            </h1>
            <p className="text-white text-3xl mb-8">
              Limitless Sports, Entertainment, and More. 
            </p>
            <p className='text-center font-bold text-white'>Let’s Get Started! Are you ready to jump in?</p>
            <p className='text-center font-bold text-white'>Search for your sport and country below to begin your adventure!</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <div className='flex m-4 gap-2'>
            <TextField
              label="Search Sports"
              variant="outlined"
              fullWidth
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="mb-4"
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '1.2rem',
                },
              }}
            />

            <Button
              variant='contained'
              type="submit"
              style={{
                width: '200px',
                fontSize: '16px',
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      <Dialog
        open={searchDialogOpen}
        onClose={handleCloseSearchDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '100vh',
            width: '80vw',
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center">
            <IconButton className='font-bold'>
              <SportsSoccerIcon />
            </IconButton>
            <h2 className="ml-2 text-3xl font-bold">Search Country & Sports</h2>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <h2 className="text-2xl font-bold mb-2">Country Selection</h2>
          <Autocomplete
            multiple
            options={Object.values(countries).map(country => ({ name: country.name }))}
            getOptionLabel={(option) => option.name}
            value={selectedCountries.map((country) => ({ name: country }))}
            onChange={(event, newValue) => {
              setSelectedCountries(newValue.map((country) => country.name));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Select Countries" />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.name} />
              </li>
            )}
          />

          <h2 className="text-2xl font-bold mb-2 mt-4">Sports Selection</h2>
          <Autocomplete
            multiple
            options={sportsData.map(sport => ({ name: sport.name }))}
            getOptionLabel={(option) => option.name}
            value={selectedSports.map((sport) => ({ name: sport }))}
            onChange={(event, newValue) => {
              setSelectedSports(newValue.map((sport) => sport.name));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" placeholder="Select Sports" />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.name} />
              </li>
            )}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseSearchDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSportSubmit} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default HomePage;
