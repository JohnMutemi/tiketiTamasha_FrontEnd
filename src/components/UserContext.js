// src/components/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      // Attempt to retrieve user and token from localStorage and sessionStorage
      const storedUser =
        JSON.parse(localStorage.getItem('user')) ||
        JSON.parse(sessionStorage.getItem('user'));
      const storedToken =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      if (storedUser) {
        setUser(storedUser);
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error retrieving user or token from storage:', error);
    }
  }, []);

  const login = (userData, authToken, stayLoggedIn) => {
    try {
      setUser(userData);
      setToken(authToken);

      // Select the appropriate storage method
      const storage = stayLoggedIn ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('token', authToken);
    } catch (error) {
      console.error('Error storing user or token:', error);
    }
  };

  const logout = () => {
    // Clear state and storage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
