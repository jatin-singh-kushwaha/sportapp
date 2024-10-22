import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 

const SearchResults = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const selectedCountries = queryParams.get('countries')?.split(',') || [];
  const selectedSports = queryParams.get('sports')?.split(',') || [];

  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    const fetchSportsData = async () => {
      try {
        const sportsQuery = query(collection(db, 'sports'), where('name', 'in', selectedSports));
        const querySnapshot = await getDocs(sportsQuery);
        const sportsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSportsData(sportsList);
      } catch (error) {
        console.error('Error fetching sports data from Firebase:', error);
      }
    };

    fetchSportsData();
  }, [selectedSports]);

  return (
    <div className="p-4 bg-black">
      <h1 className="text-4xl font-bold text-white mb-4">Search Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sportsData.map(sport => (
          <div key={sport.id} className="border rounded-lg shadow-2xl p-4">
            <div className="relative group">
              {/* Sport Image */}
              <img
                src={sport.image}
                alt={`${sport.name}`}
                className="w-full h-48 object-cover rounded-lg mb-4   group-hover:opacity-50 transition-opacity duration-300"
              />
              {/* Sport Name (always displayed) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-4xl text-white font-bold">{sport.name}</h3>
              </div>
            </div>

            <h4 className="text-xl text-white font-bold mb-2">Available Channels by Country:</h4>
            <div>
              {selectedCountries.map(countryName => {
                const country = sport.countries.find(c => c.countryCode === countryName);

                return (
                  <div key={countryName} className="mb-4">
                    {country ? (
                      <>
                        <div key={country.countryCode} className="bg-white border-x-blue-700 rounded-lg shadow-lg p-6">
                          <h3 className="text-3xl font-semibold mb-2">{country.countryCode}</h3>
                          {Array.isArray(country.channels) && country.channels.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                              {country.channels.map(channel => (
                                <div
                                  key={channel.name}
                                  className="bg-gray-100 border-8 border-blue-600 rounded-lg p-4 flex flex-col items-center transform transition-transform hover:scale-105"
                                >
                                  <a
                                    href={channel.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center w-full"
                                  >
                                    <img
                                      src={channel.image}
                                      alt={`${channel.name} logo`}
                                      className="w-24 h-24 mb-2"
                                    />
                                    <span className="text-lg font-semibold text-center">{channel.name}</span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-red-500">No channels available for this country.</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-red-500">Country not found: {countryName}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
