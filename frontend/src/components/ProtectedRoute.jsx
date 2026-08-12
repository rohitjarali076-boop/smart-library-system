import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const userRole = user?.role?.toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const formattedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());
    if (!formattedAllowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;