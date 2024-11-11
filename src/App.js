import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/cms/ProtectedRoute';
import ForgotPassword from './components/cms/ForgotPassword';
import HomePage from './components/HomePage';
import CountryPage from './components/CountryPage';
import SportsPage from './components/SportsPage';
import SportsDetail from './components/SportDetail'; 
import Footer from './components/footer/footer'; 
import Header from './components/header/header';
import SearchResults from './components/SearchResults';
import Login from './components/cms/Login';
import SignUp from './components/cms/SignUp'; 
import Dashboard from './components/cms/Dashboard';
import ManageSports from './components/cms/ManageSports';
import CMSLayout from './components/cms/CMSLayout'; 
import ManageChannels from './components/cms/ManageChannels';
import ChannelPage from './components/cms/ChannelPage';
import PrivacyPolicy from './components/footer/privacy/PrivacyPolicy'; // Adjust the path as necessary
import About from './components/footer/about/About'; // Adjust the path as necessary
import ContactUs from './components/footer/contactUs/ContactUs'; // Adjust the path as necessary
const AppLayout = ({ children, countryCode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isHomePage && <Header countryCode={countryCode} />}
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const [countryCode, setCountryCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json');
        const userCountry = response.data.countryCode; 
        setCountryCode(userCountry);
      } catch (error) {
        console.error('Error fetching location:', error);
        setCountryCode('US'); // Fallback to US if there is an error
      } finally {
        setLoading(false); 
      }
    };
    fetchLocation();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>Your App Title</title>
          <meta name="description" content="Your app description" />
        </Helmet>
        <AppLayout countryCode={countryCode}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage countryCode={countryCode} />} />
            <Route path="/country/:countryCode" element={<CountryPage countryCode={countryCode} />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/sports/:sportName" element={<SportsDetail />} />
            <Route path="/searchresult" element={<SearchResults />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/signup" element={<SignUp />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute><CMSLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/manage-sports" element={<ManageSports />} />
              <Route path="/admin/manage-channels" element={<ManageChannels />} />
              <Route path="/admin/channels/:countryId" element={<ChannelPage />} />
            </Route>
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;