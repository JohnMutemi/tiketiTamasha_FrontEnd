import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [otpToken, setOtpToken] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    try {
      const storedUser =
        JSON.parse(localStorage.getItem('user')) ||
        JSON.parse(sessionStorage.getItem('user'));
      const storedToken =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedOtpToken = localStorage.getItem('otpToken');
      const storedTicket = JSON.parse(localStorage.getItem('selectedTicket'));

      if (storedUser) {
        setUser(storedUser);
        console.log('User loaded from storage:', storedUser);
      }
      if (storedToken) {
        setToken(storedToken);
        console.log('Token loaded from storage:', storedToken);
      }
      if (storedOtpToken) {
        setOtpToken(storedOtpToken);
        console.log('OTP Token loaded from storage:', storedOtpToken);
      }
      if (storedTicket) {
        setSelectedTicket(storedTicket);
        console.log('Selected ticket loaded from storage:', storedTicket);
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
      console.log('User and token stored:', { userData, authToken });
    } catch (error) {
      console.error('Error storing user or token:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setOtpToken(null);
    setSelectedTicket(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('otpToken');
    localStorage.removeItem('selectedTicket');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    console.log('User and tokens cleared from storage');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        otpToken,
        selectedTicket,
        setOtpToken,
        setSelectedTicket,
        login,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
