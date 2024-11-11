import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';

const Dashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const { userDoc } = useAuth(); // Assuming this is where admin info is stored
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For approval/rejection feedback

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('pendingApproval', '==', true));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingUsers(users);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (userId, userEmail) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { pendingApproval: false, role: 'admin' });
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setFeedbackMessage(`User ${userEmail} has been approved successfully.`); // Approval feedback
    } catch (error) {
      console.error('Error approving user:', error);
      setFeedbackMessage('There was an error approving the user. Please try again.'); // Error feedback
    }
  };

  const rejectUser = async (userId, userEmail) => {
    try {
      await updateDoc(doc(db, 'users', userId), { pendingApproval: false, rejected: true });
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      setFeedbackMessage(`User ${userEmail} has been rejected.`); // Rejection feedback
    } catch (error) {
      console.error('Error rejecting user:', error);
      setFeedbackMessage('There was an error rejecting the user. Please try again.'); // Error feedback
    }
  };

  // Function to trigger OTP send for password reset
  const sendOtpEmail = async () => {
    try {
      const adminEmail = userDoc?.email;
      if (!adminEmail) throw new Error('Admin email not found');

      await sendPasswordResetEmail(auth, adminEmail);
      setIsOtpSent(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Failed to send OTP. Please try again.');
    }
  };

  // Function to handle password reset with OTP confirmation
  const handlePasswordReset = async () => {
    try {
      if (otp !== '123456') {
        setErrorMessage('Invalid OTP');
        return;
      }

      const resetPassword = prompt('Enter your new password:');
      if (resetPassword) {
        await confirmPasswordReset(auth, otp, resetPassword);
        alert('Password has been reset successfully');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Admin Info */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-lg font-medium mb-2">Welcome, {userDoc ? userDoc.email : 'Admin'}</p>
          <p className="text-gray-600">Role: {userDoc ? userDoc.role : 'Admin'}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mb-6">
          <ul className="flex space-x-6">
            <li>
              <Link to="/manage-sports" className="text-blue-500 hover:underline">Manage Sports</Link>
            </li>
            <li>
              <Link to="/manage-channels" className="text-blue-500 hover:underline">Manage Channels</Link>
            </li>
            <li>
              <Link to="/manage-events" className="text-blue-500 hover:underline">Manage Events</Link>
            </li>
          </ul>
        </nav>

        {/* Pending User Approvals */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
          {pendingUsers.length > 0 ? (
            <ul>
              {pendingUsers.map(user => (
                <li key={user.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span>{user.email}</span>
                  <div className="space-x-4">
                    <button
                      onClick={() => approveUser(user.id, user.email)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectUser(user.id, user.email)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pending approvals</p>
          )}
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="bg-green-500 text-white p-4 mb-6 rounded-md">
            <p>{feedbackMessage}</p>
          </div>
        )}

        {/* Reset Password Section */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
          {!isOtpSent ? (
            <div>
              <button
                onClick={sendOtpEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send OTP
              </button>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              />
              <button
                onClick={handlePasswordReset}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Reset Password
              </button>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
