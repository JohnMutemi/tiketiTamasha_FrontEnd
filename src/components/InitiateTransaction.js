import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './InitiateTransaction.css';

function InitiateTransaction({ ticketPrice, selectedTicketId }) {
  const { user } = useUser();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(ticketPrice || '');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticketPrice) {
      setAmount(ticketPrice);
    }
  }, [ticketPrice]);

  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < ticketPrice) {
      setError(`Amount cannot be less than ${ticketPrice}`);
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !amount) {
      setError('Please enter both phone number and amount.');
      return;
    }

    setLoading(true);
    setError('');
    setTransactionStatus('');

    const requestData = {
      phone_number: phoneNumber,
      amount: parseFloat(amount),
      email: user.email,
      ticket_id: selectedTicketId,
      user_id: user.user_id,
    };

    console.log('Request Data:', requestData); // Log the request payload

    try {
      const response = await fetch(
        'https://tiketi-tamasha-backend-1.onrender.com/initiate-transaction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTransactionStatus(
          'Transaction initiated successfully. Please check your phone.'
        );

        // Set a timeout to refresh the page after 3 seconds
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 3000); // 3 seconds delay
      } else {
        setError(data.error || 'Failed to initiate transaction.');
      }
    } catch (error) {
      setError('An error occurred while initiating the transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="initiate-transaction">
      <h2>Initiate MPESA Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone-number">Phone Number:</label>
          <input
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (KSH):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            min={ticketPrice}
            placeholder={`Enter the amount (minimum ${ticketPrice})`}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Initiate Transaction'}
        </button>
      </form>
      {transactionStatus && (
        <p className="status success">{transactionStatus}</p>
      )}
      {error && <p className="status error">{error}</p>}
    </div>
  );
}

export default InitiateTransaction;
