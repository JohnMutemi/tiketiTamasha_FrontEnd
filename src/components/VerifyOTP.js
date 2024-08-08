import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verifyOTP.css';

const VerifyOTP = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5555/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, otp }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
