import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getName, getCode } from 'country-list';

const ManageChannels = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCountry, setNewCountry] = useState({ country: '', flagImageUrl: '', channels: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch countries from Firebase
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesCollection = collection(db, 'streaming');
        const countrySnapshot = await getDocs(countriesCollection);
        const countryList = countrySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Filter countries based on search query
  const filteredCountries = countries.filter(country => {
    return country && country.country && getName(country.country).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    navigate(`/admin/channels/${country.id}`);
  };

  const handleDeleteCountry = async (countryId) => {
    if (window.confirm('Are you sure you want to delete this country and all associated channels?')) {
      try {
        const countryRef = doc(db, 'streaming', countryId);
        await deleteDoc(countryRef);
        setCountries(countries.filter(country => country.id !== countryId));
        alert('Country deleted successfully!');
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    }
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    const countryCode = getCode(newCountry.country);
    if (!countryCode) {
      alert("Invalid country name");
      return;
    }
    const flagImageUrl = `https://flagcdn.com/w1600/${countryCode.toLowerCase()}.jpg`;
    try {
      const countriesCollection = collection(db, 'streaming');
      const newCountryData = {
        country: countryCode,
        channels: []
      };
      const docRef = await addDoc(countriesCollection, newCountryData);
      setCountries([...countries, { id: docRef.id, ...newCountryData }]);
      setNewCountry({ country: '', flagImageUrl: '', channels: [] });
      setIsModalOpen(false);
      alert('Country added successfully!');
    } catch (error) {
      console.error("Error adding country:", error);
    }
  };

  return (
    <div className="min-h-screen py-6">
      <div className="bg-gray-100 max-w-screen-xl mx-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Manage Countries</h2>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search for a country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-3/4 sm:w-2/3 lg:w-1/2 px-4 py-3 rounded-lg border-2 border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>

        {/* Add Country Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Country
          </button>
        </div>

        {/* Country Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredCountries.map(country => {
            const flagImageUrl = `https://flagcdn.com/w1600/${country.country?.toLowerCase()}.jpg`;
            return (
              <div
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className="p-6 bg-white border border-gray-900 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              >
                <img
                  src={flagImageUrl}
                  alt={`${country.country} flag`}
                  className="w-24 h-18 mx-auto mb-4 border border-gray-900 object-cover rounded-lg"
                />
                <span className="block text-center font-semibold text-lg text-gray-700">{getName(country.country)}</span>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCountry(country.id);
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Adding a Country */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-80 md:w-1/3 lg:w-1/4 xl:w-1/5">
              <h3 className="text-xl font-semibold text-center mb-4">Add New Country</h3>
              <form onSubmit={handleAddCountry}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="country">Country Name</label>
                  <input
                    type="text"
                    id="country"
                    value={newCountry.country}
                    onChange={(e) => setNewCountry({ ...newCountry, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add Country
                </button>
              </form>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full text-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageChannels;
