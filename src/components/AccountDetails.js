import React, { useState, useEffect } from 'react';
import './accountdets.css';
import AccountSettings from './AccountSettings';
import ticket from './ticket_11785924.png';
import { Link } from 'react-router-dom';

function AccountDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [currentView, setCurrentView] = useState('details');

  useEffect(() => {
    fetch('http://localhost:5555/users')
      .then((response) => response.json())
      .then((data) => setUserDetails(data))
      .catch((error) => console.error('Error fetching user details:', error));
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="account-container">
      <div className="sidebar">
        <a href="icon">👤</a>
        <button
          onClick={() => handleViewChange('details')}
          className={currentView === 'details' ? 'active' : ''}>
          Details
        </button>
        <button
          onClick={() => handleViewChange('settings')}
          className={currentView === 'settings' ? 'active' : ''}>
          Settings
        </button>
        <a href="#logout">Logout</a>
      </div>
      <div className="account-details">
        <Link to="/">
          <img src={ticket} alt="Logo" className="logoo" />
        </Link>
        {currentView === 'details' ? (
          <>
            <h1>My Account</h1>
            {userDetails ? (
              <>
                <p>
                  <strong>User Name:</strong> {userDetails.username}
                </p>
                <p>
                  <strong>Email Address:</strong> {userDetails.email}
                </p>
                <p>
                  <strong>Role:</strong> {userDetails.role}
                </p>
              </>
            ) : (
              <p>Loading account details...</p>
            )}
          </>
        ) : (
          <AccountSettings userDetails={userDetails} />
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2024 Tiketi Tamasha. All rights reserved.</p>
        <a href="#">About us</a>
        <a href="#">Help</a>
        <a href="#">Customer Service</a>
        <a href="#">Download the Tiketi Tamasha app</a>
      </footer>
    </div>
  );
}

export default AccountDetails;
