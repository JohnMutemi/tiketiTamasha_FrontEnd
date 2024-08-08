import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verifyOTP.css';

const VerifyOTP = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting OTP verification with:', { username, otp });

      // Send the OTP along with the access token to the /verify-otp endpoint
      const response = await fetch('http://127.0.0.1:5555/verify-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        console.log('OTP verification successful');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError('OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('An error occurred during OTP verification. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="OTP"
        required
      />
      <button type="submit">Verify OTP</button>
    </form>
  );
};

export default VerifyOTP;
