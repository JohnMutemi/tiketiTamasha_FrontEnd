import React, { useState, useEffect } from 'react';
import './InitiateTransaction.css';

function InitiateTransaction({ ticketPrice, onClose, onBack }) {
  const current_user = JSON.parse(sessionStorage.getItem('user'));
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

    try {
      const response = await fetch(
        'http://127.0.0.1:5555/initiate-transaction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
            amount: parseFloat(amount),
            email: current_user.email,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTransactionStatus(
          'Transaction initiated successfully. Please check your phone.'
        );
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
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Initiate Transaction'}
          </button>
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
      {transactionStatus && (
        <p className="status success">{transactionStatus}</p>
      )}
      {error && <p className="status error">{error}</p>}
    </div>
  );
}

export default InitiateTransaction;
