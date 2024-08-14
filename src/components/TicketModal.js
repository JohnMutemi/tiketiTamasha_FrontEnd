import React, { useState, useEffect } from 'react';
import './ticket.css';
import PaymentModal from './PaymentModal';

function TicketModal({ onClose }) {
  const [tickets, setTickets] = useState([]);
  const [uniqueTicketTypes, setUniqueTicketTypes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Fetch tickets
    fetch('http://127.0.0.1:5555/tickets')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);

        // Extract unique ticket types
        const ticketTypes = new Set(data.map((ticket) => ticket.ticket_type));
        setUniqueTicketTypes([...ticketTypes]);

        // Set initial selected ticket
        setSelectedTicket(data[0]);
      });
  }, []);

  const handleTicketChange = (event) => {
    const ticketType = event.target.value;
    const ticket = tickets.find((t) => t.ticket_type === ticketType);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  const handleBookNow = () => {
    // switch to PaymentModal by hiding TicketModal
    setShowPaymentModal(true);
  };

  return (
    <>
      {!showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Select Ticket Type</h2>
            <div className="ticket-options">
              <select
                onChange={handleTicketChange}
                value={selectedTicket?.ticket_type || ''}>
                <option value="" disabled>
                  Select a ticket type
                </option>
                {uniqueTicketTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {selectedTicket && (
              <div className="ticket-details">
                <p>
                  <strong>Price:</strong> $
                  {parseFloat(selectedTicket.price).toFixed(2)}
                </p>
              </div>
            )}
            <div className="button-container">
              <button className="book-now-button" onClick={handleBookNow}>
                Book Now
              </button>
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render PaymentModal if showPaymentModal is true */}
      {showPaymentModal && (
        <PaymentModal
          ticket={selectedTicket}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}

export default TicketModal;

