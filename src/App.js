import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route,  useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './components/HomePage';
import CountryPage from './components/CountryPage';
import SportsPage from './components/SportsPage';
import SportsDetail from './components/SportDetail'; 
import Footer from './components/footer/footer'; 
import Header from './components/header/header';
import SearchResults from './components/SearchResults';

const AppLayout = ({ children, countryCode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // Check if it's the home page

  return (
    <div className="flex flex-col min-h-screen">
      {!isHomePage && <Header countryCode={countryCode} />}  {/* Pass countryCode to Header */}
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json');
        const userCountry = response.data.countryCode; 
        console.log(response.data);
        setCountryCode(userCountry);
      } catch (error) {
        console.error('Error fetching location:', error);
        setCountryCode('US'); // Fallback to US if there is an error
      }
    };
    fetchLocation();
  }, []);

  // Redirect to country page once countryCode is fetched
  if (!countryCode) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <Router>
      <AppLayout countryCode={countryCode}> {/* Pass countryCode to AppLayout */}
        <Routes>
          <Route path="/" element={<HomePage countryCode={countryCode} />} />  {/* HomePage Route */}
          <Route path="/country/:countryCode" element={<CountryPage countryCode={countryCode} />} />
          <Route path="/sports" element={<SportsPage />} /> 
          <Route path="/sports/:sportName" element={<SportsDetail />} />
          <Route path="/searchresult" element={<SearchResults />} />
         
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
