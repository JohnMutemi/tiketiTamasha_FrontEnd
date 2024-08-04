import React, { useState } from 'react';
import './ticket.css'; 

function TicketModal({ tickets, onClose }) {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);

  const handleTicketChange = (ticketType) => {
    const ticket = tickets.find((t) => t.type === ticketType);
    if (ticket) {
      setSelectedTicket(ticket);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Select Ticket Type</h2>
        <div className="ticket-options">
          {tickets.map((ticket) => (
            <button
              key={ticket.type}
              className={`ticket-option ${ticket.type === selectedTicket.type ? 'active' : ''}`}
              onClick={() => handleTicketChange(ticket.type)}
            >
              {ticket.type}
            </button>
          ))}
        </div>
        <div className="ticket-details">
          <p>
            <strong>Price:</strong> ${parseFloat(selectedTicket.price).toFixed(2)}
          </p>
          <p>
            <strong>Description:</strong> {selectedTicket.description}
          </p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default TicketModal;
