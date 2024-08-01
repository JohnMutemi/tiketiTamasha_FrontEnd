import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { useUser } from './UserContext';

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
        login({
          username: userData.username,
          userId: userData.user_id,
          email: userData.email,
          token: userData.access_token,
        });
        setError('');
        setSuccess('Login successful!');
        const dashboardPath =
          userData.role === 'event_organizer'
            ? '/organizer-dashboard'
            : '/customer-dashboard';
        setTimeout(() => navigate(dashboardPath), 1000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess('');
      });
  };

  const handleLogin = (userData) => {
    const stayLoggedIn = document.getElementById(
      'stayLoggedInCheckbox'
    ).checked;
    login(userData, stayLoggedIn);
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
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
            New to TiketiTamasha? <a href="/register">Create account</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
