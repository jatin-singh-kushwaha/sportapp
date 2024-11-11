import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null); // Store Firestore user doc

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid); // Get a reference to the user document
        const userDocSnapshot = await getDoc(userDocRef); // Fetch the document
        setUserDoc(userDocSnapshot.data());
      } else {
        // If no user is logged in, reset userDoc state
        setUserDoc(null);
      }
    });
    return unsubscribe; // Unsubscribe when the component is unmounted
  }, []);

  const signUp = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add the new user to Firestore with a pending approval status
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      username: username, // Save username to Firestore
      role: 'user', // Default role
      pendingApproval: true, // Require admin approval
    });
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setCurrentUser(null); // Clear current user state
      setUserDoc(null); // Clear user document state
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error('Error sending reset email: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userDoc, login, signUp, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
