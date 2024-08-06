import React, { useState, useEffect } from 'react';
import './ticket.css';
import { useNavigate } from 'react-router-dom';

function TicketModal({ onClose }) {
  const [tickets, setTickets] = useState([]);
  const [uniqueTicketTypes, setUniqueTicketTypes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

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

    // Check if user is logged in and their role
    fetch('http://127.0.0.1:5555/session', { credentials: 'include' })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Not logged in');
        }
      })
      .then(() => {
        setUserLoggedIn(true);
        return fetch('http://127.0.0.1:5555/user-role', {
          credentials: 'include',
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setUserRole(data.role);
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
        setUserLoggedIn(false);
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
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }
    if (userRole !== 'customer') {
      alert('Only customers can book tickets.');
      return;
    }

    // Perform booking action
    fetch('http://127.0.0.1:5555/book-ticket', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id: selectedTicket.id }), // Pass necessary data
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          onClose();
        } else {
          alert(data.error || 'An error occurred');
        }
      })
      .catch((error) => {
        console.error('Error booking ticket:', error);
      });
  };

  return (
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
  );
}

export default TicketModal;
