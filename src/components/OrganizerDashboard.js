import React, { useState, useEffect } from 'react';
import './OrganizerDashboard.css';
import { useUser } from './UserContext';

const OrganizerDashboard = () => {
  const { user, onLogout, token } = useUser();

  const [events, setEvents] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    total_tickets: '',
    remaining_tickets: '',
    image_url: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    console.log('Fetching events');
    fetch('http://127.0.0.1:5555/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched events:', data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const hostNewEvent = () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('start_time', form.start_time);
    formData.append('end_time', form.end_time);
    formData.append('total_tickets', form.total_tickets);
    formData.append('remaining_tickets', form.remaining_tickets);
    formData.append('image_url', form.image_url);

    fetch('http://127.0.0.1:5555/organizer-dashboard', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.id) {
          setEvents([data, ...events]); // Add new event at the beginning
          alert('Event hosted successfully');
          setForm({
            title: '',
            description: '',
            location: '',
            start_time: '',
            end_time: '',
            total_tickets: '',
            remaining_tickets: '',
            image_url: '',
          });
          setFormVisible(false);
        } else {
          console.error('Error hosting event:', data);
        }
      })
      .catch((error) => console.error('Error hosting event:', error));
  };

  const viewDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <div className="profile-menu">
          <i className="fas fa-user profile-icon"></i>
          <div className="dropdown">
            <div className="dropdown-content">
              <span>Upcoming Events</span>
              <a onClick={() => setFormVisible(true)}>
                Click here to host your event
              </a>
              <a href="#logout" onClick={onLogout}>
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <nav className="sidebar">
          <ul>
            <li>
              <a href="#orders">Orders</a>
            </li>
            <li>
              <a href="#listings">Listings</a>
            </li>
            <li>
              <a href="#payments">Payments</a>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {formVisible && (
            <section id="host-new-event" className="host-event-section">
              <h2>Host a New Event</h2>
              <form className="host-event-form">
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required></textarea>
                </label>
                <label>
                  Location:
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Start Time:
                  <input
                    type="datetime-local"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Total Tickets:
                  <input
                    type="number"
                    name="total_tickets"
                    value={form.total_tickets}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Remaining Tickets:
                  <input
                    type="number"
                    name="remaining_tickets"
                    value={form.remaining_tickets}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Image URL:
                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                  />
                </label>
                <button type="button" onClick={hostNewEvent}>
                  Host Event
                </button>
                <button type="button" onClick={() => setFormVisible(false)}>
                  Cancel
                </button>
              </form>
            </section>
          )}

          <section id="upcoming-events" className="events-section">
            <h2>Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.id} className="event-card">
                    <img
                      src={event.image_url || 'default-image.jpg'}
                      alt={event.title}
                      className="event-image"
                    />
                    <h3>{event.title}</h3>
                    <p>Date: {new Date(event.start_time).toLocaleString()}</p>
                    <p>Location: {event.location}</p>
                    <p>Description: {event.description}</p>
                    <p>Total Tickets: {event.total_tickets}</p>
                    <p>Remaining Tickets: {event.remaining_tickets}</p>
                    <button
                      onClick={() => viewDetails(event)}
                      className="view-details-button">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events found</p>
            )}
          </section>

          {selectedEvent && (
            <section className="event-details-section">
              <h2>Event Details</h2>
              <div className="event-details-card">
                <img
                  src={selectedEvent.image_url || 'default-image.jpg'}
                  alt={selectedEvent.title}
                  className="event-details-image"
                />
                <h3>{selectedEvent.title}</h3>
                <p>
                  Date: {new Date(selectedEvent.start_time).toLocaleString()}
                </p>
                <p>Location: {selectedEvent.location}</p>
                <p>Description: {selectedEvent.description}</p>
                <p>Total Tickets: {selectedEvent.total_tickets}</p>
                <p>Remaining Tickets: {selectedEvent.remaining_tickets}</p>
                {selectedEvent.tickets && selectedEvent.tickets.length > 0 && (
                  <div>
                    <h4>Available Tickets:</h4>
                    <ul>
                      {selectedEvent.tickets.map((ticket, index) => (
                        <li key={index}>{ticket}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={closeDetails} className="close-details-button">
                  Close
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="footer">
        <ul>
          <li>
            <a href="#contact">Contact</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
          <li>
            <a href="#terms">Terms</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default OrganizerDashboard;
