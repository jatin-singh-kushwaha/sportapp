// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCxEMLHzfw1GYM-qrDmIjPgQU_qWKkvwzY",
  authDomain: "sportstreamingplatform.firebaseapp.com",
  projectId: "sportstreamingplatform",
  storageBucket: "sportstreamingplatform.appspot.com",
  messagingSenderId: "91344715845",
  appId: "1:91344715845:web:758590c965c74b47bba32c",
  measurementId: "G-SC6E13YM3F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { db }; // Export the db object
