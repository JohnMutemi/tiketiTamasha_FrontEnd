import React, { useState } from 'react';
import TicketModal from './TicketModal';
import './EventList.css';

function EventList({ events }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTickets, setSelectedEventTickets] = useState([]);

  const handlePurchaseClick = (tickets) => {
    setSelectedEventTickets(tickets);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="event-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                className="event-image"
              />
            )}
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div>
              {event.tickets.map((ticket, index) => (
                <p key={ticket.id || index}>
                  <strong>Price:</strong> ${parseFloat(ticket.price).toFixed(2)}
                </p>
              ))}
            </div>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Start Time:</strong>{' '}
              {new Date(event.start_time).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong>{' '}
              {new Date(event.end_time).toLocaleString()}
            </p>
            <button
              className="purchase"
              onClick={() => handlePurchaseClick(event.tickets)}>
              Grab Your Ticket
            </button>
          </div>
        ))
      ) : (
        <p>No events found</p>
      )}
      {isModalOpen && (
        <TicketModal tickets={selectedEventTickets} onClose={closeModal} />
      )}
    </div>
  );
}

export default EventList;
