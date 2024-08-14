import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { useUser } from './UserContext';
import ticket from './ticket_11785924.png';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('stayLoggedIn', stayLoggedIn.toString());

    fetch('http://127.0.0.1:5555/login', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Login failed');
          });
        }
        return response.json();
      })
      .then((userData) => {
        const { access_token, ...userInfo } = userData;
        login(userInfo, access_token, stayLoggedIn);
        setError('');
        setSuccess('Login successful!');
        const dashboardPath =
          userData.role === 'admin'
            ? '/admin-dashboard'
            : userData.role === 'event_organizer'
            ? '/organizer-dashboard'
            : '/customer-dashboard';
        setTimeout(() => navigate(dashboardPath), 1000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess('');
      });
  };

  const handleTicketClick = () => {
    navigate('/');
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <img
          src={ticket}
          alt="ticket"
          className="ticket"
          onClick={handleTicketClick}
          style={{ cursor: 'pointer' }} // Makes the cursor a pointer when hovering over the ticket
        />
        <h3>Login to Tiketi Tamasha</h3>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="checkbox-group">
          <input
            id="stayLoggedIn"
            type="checkbox"
            checked={stayLoggedIn}
            onChange={(e) => setStayLoggedIn(e.target.checked)}
          />
          <label htmlFor="stayLoggedIn">Stay logged in</label>
        </div>
        <button type="submit" className="signin-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <div className="signup-link">
          <p>
            New to Tiketi Tamasha? <a href="/register">Create account</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
