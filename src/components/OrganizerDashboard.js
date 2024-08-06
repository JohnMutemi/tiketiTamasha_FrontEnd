import React, { useState, useEffect } from 'react';
import './OrganizerDashboard.css';
import { useUser } from './UserContext';
import NavBar from './NavBar';
import Logout from './Logout';

const OrganizerDashboard = () => {
  const { user, token } = useUser();

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

  const fetchEvents = () => {
    fetch('http://127.0.0.1:5555/organizer-dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.error('Error fetching events:', error));
  };

  useEffect(() => {
    fetchEvents();
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
          setEvents([data, ...events]);
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

  return (
    <div className="dashboard-container">
      <NavBar showLogin={false} />
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <div className="profile-menu">
          <i className="fas fa-user profile-icon"></i>
          <div className="dropdown">
            <div className="dropdown-content">
              <a href="#host-new-event" onClick={() => setFormVisible(true)}>
                Host a New Event
              </a>
              <a href="#my-events">My Events</a>
              <Logout />
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="account-details hidden">
          <h2>Account Details</h2>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>

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

        <section id="my-events" className="my-events-section">
          <h2>My Hosted Events</h2>
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

                  {/* tickets */}
                  {event.tickets && event.tickets.length > 0 && (
                    <div className="tickets-section">
                      <h4>Available Tickets:</h4>
                      <ul>
                        {event.tickets.map((ticket, index) => (
                          <li key={index}>
                            {ticket.type}: {ticket.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hosted events to show</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
