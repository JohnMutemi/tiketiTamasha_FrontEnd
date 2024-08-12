import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';
import './customer-dashboard.css';

function CustomerDashboard() {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [paymentId, setPaymentId] = useState(null); // Store the payment ID for receipt download

  useEffect(() => {
    fetch('http://127.0.0.1:5555/tickets')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(data);
          if (data.length > 0) {
            setSelectedTicket(data[0]);
          }
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const openPaymentModal = () => {
    if (selectedTicket) {
      setPaymentModalOpen(true);
    } else {
      alert('Please select a ticket before proceeding to payment.');
    }
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handleDownloadReceipt = () => {
    if (paymentId) {
      window.open(
        `http://127.0.0.1:5555/download_receipt/${paymentId}`,
        '_blank'
      );
    } else {
      alert('No payment record found to download.');
    }
  };

  return (
    <div className="customer-dashboard">
      <h2>Customer Dashboard</h2>
      <button onClick={openPaymentModal}>Proceed to Payment</button>
      <button onClick={handleDownloadReceipt}>Download Receipt</button>

      {isPaymentModalOpen && (
        <PaymentModal
          onClose={closePaymentModal}
          ticket={selectedTicket}
          onPaymentSuccess={(paymentId) => setPaymentId(paymentId)} // Update payment ID on successful payment
        />
      )}
    </div>
  );
}

export default CustomerDashboard;
