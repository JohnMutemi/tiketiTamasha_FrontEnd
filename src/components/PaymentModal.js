import React, { useState } from 'react';
import './payment.css';
import InitiateTransaction from './InitiateTransaction';

function PaymentModal({ onClose, ticket }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInitiateTransaction, setShowInitiateTransaction] = useState(false);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayNow = () => {
    if (selectedPaymentMethod === '') {
      alert('Please select a payment method.');
      return;
    }

    if (selectedPaymentMethod === 'mpesa') {
      setShowInitiateTransaction(true);
    } else {
      console.log(`Processing payment via ${selectedPaymentMethod}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Payment</h2>
        <div className="payment-details">
          <p>
            <strong>Ticket Type:</strong> {ticket?.ticket_type}
          </p>
          <p>
            <strong>Price:</strong> ${parseFloat(ticket?.price).toFixed(2)}
          </p>
        </div>
        <div className="payment-method">
          <h3>Select Payment Method</h3>
          <select
            onChange={handlePaymentMethodChange}
            value={selectedPaymentMethod}>
            <option value="" disabled>
              Select payment method
            </option>
            <option value="mpesa">MPESA</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>
        <div className="button-container">
          <button
            className="pay-button"
            onClick={handlePayNow}
            disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
      {showInitiateTransaction && ticket && (
        <InitiateTransaction ticketPrice={ticket.price} onClose={onClose} />
      )}
    </div>
  );
}

export default PaymentModal;
