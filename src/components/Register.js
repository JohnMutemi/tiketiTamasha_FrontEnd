import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('event_organizer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'role') setRole(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('role', role);

    fetch('http://127.0.0.1:5555/register', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Registration failed');
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(data.message);
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('event_organizer');

        setTimeout(() => navigate('/login'), 1000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess('');
      });
  };

  const handleGoogleSignUp = () => {
    // Redirect the user to Google's OAuth 2.0 consent page
    window.location.href = 'YOUR_GOOGLE_OAUTH_URL';
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h3>Create Account</h3>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleChange}
            required>
            <option value="event_organizer">Event Organizer</option>
            <option value="customer">Attendee</option>
          </select>
        </div>
        <button type="submit" className="register-button">
          Submit
        </button>
        <button
          type="button"
          className="google-button"
          onClick={handleGoogleSignUp}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google icon"
            className="google-icon"
          />
          Sign Up with Google
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
