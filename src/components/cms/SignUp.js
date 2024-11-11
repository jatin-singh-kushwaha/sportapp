import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Regular expression for validating email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /[0-9]/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);
    const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && numberCriteria && uppercaseCriteria && specialCharacterCriteria) {
      setPasswordStrength('Strong');
    } else if (lengthCriteria && (numberCriteria || uppercaseCriteria)) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Check password strength before proceeding
    if (passwordStrength === 'Weak') {
      alert('Password is too weak. Please choose a stronger password.');
      return;
    }

    try {
      await signUp(email, password, username);
      alert('Sign-up successful! Waiting for admin approval.');
      navigate('/admin/login');
    } catch (error) {
      alert('Failed to sign up: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value); // Check password strength on change
              }}
              placeholder="Enter your password"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className={`mt-1 text-sm ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              Password Strength: {passwordStrength}
            </p>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Already have an account? <span onClick={() => navigate('/admin/login')} className="text-blue-500 cursor-pointer hover:underline">Login</span></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
