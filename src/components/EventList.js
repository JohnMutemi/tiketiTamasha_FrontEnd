import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import TicketModal from './TicketModal';
import Map from './Map'; // Import the Map component
import { useUser } from './UserContext'; 
import './EventList.css';

function EventList({ events = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventTickets, setSelectedEventTickets] = useState([]);
  const [selectedEventLocation, setSelectedEventLocation] = useState(null);
  const { user, setSelectedTicket } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to fetch tickets for a specific event
  const fetchTickets = (eventId) => {
    console.log(`Fetching tickets for event ID: ${eventId}`);
    fetch(`http://127.0.0.1:5555/tickets/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Tickets fetched:', data);
        setSelectedEventTickets(data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });
  };

  // Open the modal and set the selected event's tickets
  const handlePurchaseClick = (eventId) => {
    if (user) {
      console.log(`Purchase button clicked for event ID: ${eventId}`); // Print statement for debugging
      fetchTickets(eventId);
      const selectedTicket = { eventId, tickets: selectedEventTickets };
      console.log('Selected ticket:', selectedTicket);

      // Store the selected ticket in local storage
      localStorage.setItem('selectedTicket', JSON.stringify(selectedTicket));

      // Update the UserContext with the selected ticket
      setSelectedTicket(selectedTicket);
      console.log('Selected ticket stored in UserContext and local storage.');

      setIsModalOpen(true);
    } else {
      // Show immediate feedback or message
      alert('Please log in to book this ticket.');

      // Redirect to login page
      navigate('/login', {
        state: { message: 'Please log in to book this ticket.' },
      });
    }
  };

  // Open the map for the selected event
  const handleMapClick = (location) => {
    console.log('Map icon clicked. Location:', location);
    setSelectedEventLocation(location);
  };

  // Close the map modal or view
  const closeMap = () => {
    console.log('Closing map modal');
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
