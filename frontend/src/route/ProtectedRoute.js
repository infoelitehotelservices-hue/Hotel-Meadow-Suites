import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import ScrollToTop from '../components/ui/ProgessScroll';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <ScrollToTop/>; // Show a loading spinner or message
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/" />;
  }

  return children;
};