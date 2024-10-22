import { useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const GettingSite = ({ country, setStreamingSites, setLoading }) => {
  useEffect(() => {
    const fetchStreamingSites = async () => {
      if (country) {
        setLoading(true);

        try {
          // Query the 'streaming' collection for sites that match the country
          const q = query(collection(db, 'streaming'), where('country', '==', country)); 
          const querySnapshot = await getDocs(q);
          
          // Map over the results to extract the necessary data
          const sites = querySnapshot.docs.flatMap(doc => {
            return doc.data().channels.map(channel => ({
              id: doc.id, // Assuming each document has a unique ID
              ...channel,
            }));
          });

          // Filter out any channels that are missing required properties
          const validSites = sites.filter(site => site.link && site.name); // Ensure link and name are present

          console.log(validSites); // Log the fetched sites
          
          // Set the streaming sites in state
          setStreamingSites(validSites);
        } catch (error) {
          console.error("Error fetching streaming sites: ", error);
          setStreamingSites([]); // Reset sites on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStreamingSites();
  }, [country, setStreamingSites, setLoading]);

  return null;
};

export default GettingSite;
