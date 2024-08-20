import React, { useState, useEffect } from 'react';
import './ticket.css';
import PaymentModal from './PaymentModal';

function TicketModal({ onClose }) {
  const [tickets, setTickets] = useState([]);
  const [uniqueTicketTypes, setUniqueTicketTypes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          'https://tiketi-tamasha-backend-1.onrender.com/tickets'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          console.log("Data before setting ticket - ",data)
          setTickets(data);

          // Extract unique ticket types
          const ticketTypes = [
            ...new Set(data.map((ticket) => ticket.ticket_type)),
          ];
          setUniqueTicketTypes(ticketTypes);

          // Set initial selected ticket
          if (data.length > 0) {
            setSelectedTicket(data[0]);
          }
        } else {
          console.error('Expected array but got:', typeof data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketChange = (event) => {
    const ticketType = event.target.value;
    const ticket = tickets.find((t) => t.ticket_type === ticketType);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  const handleBookNow = () => {
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
