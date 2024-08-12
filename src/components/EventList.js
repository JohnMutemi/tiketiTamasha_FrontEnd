import React, { useState, useEffect } from 'react';
import TicketModal from './TicketModal';
import Map from './Map'; // Import the Map component
import './EventList.css';

function EventList({ events = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTickets, setSelectedEventTickets] = useState([]);
  const [selectedEventLocation, setSelectedEventLocation] = useState(null);

  // Function to fetch tickets for a specific event
  const fetchTickets = (eventId) => {
    console.log(`Fetching tickets for event ID: ${eventId}`); // Print statement for debugging
    fetch(`http://127.0.0.1:5555/tickets/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Tickets fetched:', data); // Print the fetched ticket data
        setSelectedEventTickets(data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });
  };

  // Open the modal and set the selected event's tickets
  const handlePurchaseClick = (eventId) => {
    console.log(`Purchase button clicked for event ID: ${eventId}`); // Print statement for debugging
    fetchTickets(eventId);
    setIsModalOpen(true);
  };

  // Open the map for the selected event
  const handleMapClick = (location) => {
    console.log('Map icon clicked. Location:', location); // Print statement for debugging
    setSelectedEventLocation(location);
  };

  // Close the map modal or view
  const closeMap = () => {
    console.log('Closing map modal'); // Print statement for debugging
    setSelectedEventLocation(null);
  };

  return (
    <div className="event-list">
      {Array.isArray(events) && events.length > 0 ? (
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
            <p>
              <strong>Price:</strong> $
              {Array.isArray(event.tickets) && event.tickets.length > 0
                ? parseFloat(event.tickets[0].price).toFixed(2)
                : 'Not available'}
            </p>

            <p>
              <strong>Location:</strong>
              <img
                src="https://res.cloudinary.com/dhxtzhs6h/image/upload/v1723276686/r5yqpxezyzxryibcjqkv.png"
                alt="Map Icon"
                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                onClick={() => handleMapClick(event.location)}
              />
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
              onClick={() => handlePurchaseClick(event.id)}>
              Grab Your Ticket
            </button>
          </div>
        ))
      ) : (
        <p>No events found</p>
      )}
      {isModalOpen && (
        <TicketModal
          tickets={selectedEventTickets}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {selectedEventLocation && (
        <div className="map-modal">
          <button onClick={closeMap}>Close Map</button>
          <Map events={[{ location: selectedEventLocation }]} />
        </div>
      )}
    </div>
  );
}

export default EventList;
