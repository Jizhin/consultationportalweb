import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, allowedRoles }) {
  const access = localStorage.getItem('access');
  const role = localStorage.getItem('role');

  if (!access) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;

  return element;
}

export default ProtectedRoute;
