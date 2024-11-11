import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate email and password before logging in
    if (!validateEmail(email)) {
      setErrorEmail('Please enter a valid email address');
      return;
    } else {
      setErrorEmail('');
    }

    if (!validatePassword(password)) {
      setErrorPassword('Password must be at least 6 characters');
      return;
    } else {
      setErrorPassword('');
    }

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      alert('Failed to log in: ' + error.message);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/admin/signup');
  };

  const validateEmail = (email) => {
    // Basic email regex pattern for validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Password should be at least 6 characters long
    return password.length >= 6;
  };

  const checkPasswordStrength = (password) => {
    if (password.length <= 5) {
      setPasswordStrength('Weak');
    } else if (password.length <= 8) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Strong');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin}>
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
            {errorEmail && <p className="text-red-500 text-sm">{errorEmail}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              placeholder="Enter your password"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorPassword && <p className="text-red-500 text-sm">{errorPassword}</p>}
            <div className="mt-2">
              <span className={`text-sm ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                {passwordStrength ? `Password Strength: ${passwordStrength}` : 'Password Strength'}
              </span>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={handleForgotPassword} className="text-sm text-blue-500 hover:underline focus:outline-none">
            Forgot Password?
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account? <span onClick={handleSignUp} className="text-blue-500 cursor-pointer hover:underline">Sign Up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
