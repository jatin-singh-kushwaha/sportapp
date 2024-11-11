import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, userDoc } = useAuth();

  // If the user is not logged in or still pending approval, redirect to login
  if (!currentUser || (userDoc && userDoc.pendingApproval)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
