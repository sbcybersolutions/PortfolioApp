// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ isAdminRoute }) {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  if (isAdminRoute) {
    return isLoggedIn && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
  } else {
    // You could add a route for general logged-in users here if needed,
    // but for this CMS, all protected routes are admin routes.
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;