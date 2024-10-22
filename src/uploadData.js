
import { db } from './firebase/firebaseConfig.js'; 
import { collection, addDoc } from 'firebase/firestore';
import sportsData from './data/sportsData.js'; 
import streamingData from './data/streamingData.js'; 
import channelMapping from './data/channelMapping.js'; 

const uploadData = async () => {
  try {
    const sportsCollectionRef = collection(db, 'sports');
    const streamingCollectionRef = collection(db, 'streaming');
    const channelsCollectionRef = collection(db, 'channels');
    for (const data of sportsData) {
      await addDoc(sportsCollectionRef, data);
    }
    for (const [country, channels] of Object.entries(streamingData)) {
      await addDoc(streamingCollectionRef, { country, channels });
    }
    for (const [channelName, channelInfo] of Object.entries(channelMapping)) {
      await addDoc(channelsCollectionRef, { name: channelName, ...channelInfo });
    }

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data: ', error);
  }
};

uploadData();
