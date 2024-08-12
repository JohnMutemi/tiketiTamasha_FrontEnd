import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [otpToken, setOtpToken] = useState(null);

  useEffect(() => {
    try {
      const storedUser =
        JSON.parse(localStorage.getItem('user')) ||
        JSON.parse(sessionStorage.getItem('user'));
      const storedToken =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedOtpToken = localStorage.getItem('otpToken');

      if (storedUser) {
        setUser(storedUser);
      }
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedOtpToken) {
        setOtpToken(storedOtpToken);
      }
    } catch (error) {
      console.error('Error retrieving user or token from storage:', error);
    }
  }, []);

  const login = (userData, authToken, stayLoggedIn) => {
    try {
      setUser(userData);
      setToken(authToken);

      const storage = stayLoggedIn ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userData));
      storage.setItem('token', authToken);
    } catch (error) {
      console.error('Error storing user or token:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOtpToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('otpToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <UserContext.Provider
      value={{ user, token, otpToken, setOtpToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
