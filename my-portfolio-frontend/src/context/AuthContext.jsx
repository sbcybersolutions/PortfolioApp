// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);

  // Check localStorage for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; // localStorage stores strings

    if (storedToken && storedIsAdmin) { // We only consider them logged in if they're admin
      setToken(storedToken);
      setIsLoggedIn(true);
      setIsAdmin(true);
    }
  }, []);

  const login = (newToken, newIsAdmin) => {
    setToken(newToken);
    setIsLoggedIn(true);
    setIsAdmin(newIsAdmin);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('isAdmin', newIsAdmin);
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};