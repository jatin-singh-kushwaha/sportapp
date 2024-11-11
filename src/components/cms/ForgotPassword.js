import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';  // Import the useAuth hook
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();  // Access resetPassword from AuthContext
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);  // Call the resetPassword method
      setMessage('Password reset link sent to your email!');
      setError('');
      setEmail('');
    } catch (error) {
      setError('Failed to send reset email: ' + error.message);
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleResetPassword}>
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
          <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => navigate('/admin/login')} className="text-sm text-blue-500 hover:underline focus:outline-none">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
