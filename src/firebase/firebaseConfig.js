// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyCxEMLHzfw1GYM-qrDmIjPgQU_qWKkvwzY",
  authDomain: "sportstreamingplatform.firebaseapp.com",
  projectId: "sportstreamingplatform",
  storageBucket: "sportstreamingplatform.appspot.com",
  messagingSenderId: "91344715845",
  appId: "1:91344715845:web:758590c965c74b47bba32c",
  measurementId: "G-SC6E13YM3F"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 
// Export Firestore and Auth instances
export { db, auth,storage };
