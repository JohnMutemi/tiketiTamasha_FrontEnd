import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useUser } from './UserContext';
import ticket from './ticket_11785924.png';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('event_organizer');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const navigate = useNavigate();
  const { setOtpToken } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'role') setRole(value);
    else if (name === 'otp') setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Registering user with:', { username, email, role });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('role', role);

    try {
      const response = await fetch('http://127.0.0.1:5555/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful, sending OTP to:', email);

      setOtpToken(data.otpToken);

      setSuccess(
        'Registration successful! An OTP has been sent to your email.'
      );
      setError('');
      setIsOtpSent(true);
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message);
      setSuccess('');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    console.log('Verifying OTP for email:', email);

    try {
      const otpToken = localStorage.getItem('otpToken');
      console.log('OTP Token:', otpToken);

      const response = await fetch('http://127.0.0.1:5555/verify-otp', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${otpToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      const data = await response.json();
      if (data.message === 'User registered and logged in successfully') {
        setSuccess('OTP verification successful!');
        setError('');
        setIsOtpSent(false);
        console.log('OTP verified, redirecting to login.');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        console.error('OTP verification failed:', data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error.message);
      setError(error.message);
      setSuccess('');
    }
  };

  const handleTicketClick = () => {
    navigate('/');
  };

  return (
    <div className="register-container">
      <img
        src={ticket}
        alt="ticket"
        className="ticket"
        onClick={handleTicketClick}
        style={{ cursor: 'pointer' }} 
      />
      <form
        onSubmit={isOtpSent ? handleOtpSubmit : handleSubmit}
        className="register-form"
      >
        <h3>{isOtpSent ? 'Verify OTP' : 'Create Account'}</h3>

        {!isOtpSent ? (
          <>
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
                required
              >
                <option value="event_organizer">Event Organizer</option>
                <option value="customer">Attendee</option>
              </select>
            </div>
            <button type="submit" className="register-button">
              Submit
            </button>
          </>
        ) : (
          <>
            <div className="input-group">
              <label htmlFor="otp">OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="register-button">
              Verify OTP
            </button>
          </>
        )}

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
