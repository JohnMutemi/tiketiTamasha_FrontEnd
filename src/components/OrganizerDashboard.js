import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import Logout from './Logout';
import NavBar from './NavBar';
import AttendeeList from './AttendeeList'; // Import the AttendeeList component
import './OrganizerDashboard.css';

function OrganizerDashboard({ eventId }) {
  const { user, token } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    imageUrl: '',
    totalTickets: '',
    remainingTickets: '',
    latitude: '',
    longitude: '',
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchEvents();
    }
  }, [user, token]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/organizer-events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data.events || []);
      setError('');
    } catch (error) {
      setError('Error fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Adding event with data:', formData);
    try {
      const response = await fetch('http://127.0.0.1:5555/organizer-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      setEvents((prev) => [...prev, newEvent.event]);
      setMessage('Event added successfully!');
      clearForm();
    } catch (error) {
      setMessage('Error adding event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Updating event with ID:', editingEvent);
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/organizer-events/${editingEvent}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEvent ? { ...ev, ...updatedEvent.event } : ev
        )
      );
      setMessage('Event updated successfully!');
      clearForm();
    } catch (error) {
      setMessage('Error updating event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setLoading(true);
    console.log('Deleting event with ID:', eventId);
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/organizer-events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setMessage('Event deleted successfully!');
    } catch (error) {
      setMessage('Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.start_time,
      endTime: event.end_time,
      imageUrl: event.image_url,
      totalTickets: event.total_tickets,
      remainingTickets: event.remaining_tickets,
      latitude: event.latitude,
      longitude: event.longitude,
    });
    setFormVisible(true);
  };

  const handleViewEventDetails = async (eventId) => {
    console.log(`Viewing details for event ID: ${eventId}`);
    setSelectedEvent(eventId);
    fetchEventAttendees(eventId);
  };

  const fetchEventAttendees = async (eventId) => {
    setLoading(true);
    setAttendees([]); // Clear previous attendees
    setMessage('');

    try {
      const response = await fetch(
        `http://127.0.0.1:5555/events/${eventId}/attendees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendees');
      }

      const data = await response.json();
      setAttendees(data);

      console.log('DATA:', data); // Correctly logs fetched data

      if (data.attendees && data.attendees.length === 0) {
        setMessage('Attendees not found.');
      }
    } catch (error) {
      setMessage('Error fetching attendees');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId && token) {
      fetchEventAttendees(eventId);
    }
  }, [eventId, token]); // Fetch attendees whenever eventId or token changes

  // Optional: Log attendees after it is updated
  useEffect(() => {
    console.log('ATTENDEES ARE:', attendees);
  }, [attendees]);

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
      imageUrl: '',
      totalTickets: '',
      remainingTickets: '',
      latitude: '',
      longitude: '',
    });
    setFormVisible(false);
    setEditingEvent(null);
  };

  return (
    <div className="organizer-dashboard">
      <NavBar showLogin={false} />
      <header className="dashboard-header">
        <h1>Welcome, {user ? user.username : 'Guest'}</h1>
        <div className="profile-menu">
          <i className="fas fa-user profile-icon"></i>
          <div className="dropdown">
            <div className="dropdown-content">
              <Logout />
            </div>
          </div>
        </div>
      </header>

      <section className="dashboard-hero">
        <div className="my-events">
          <h2>
            <a href="#" onClick={() => setFormVisible((prev) => !prev)}>
              {isFormVisible ? 'Hide Form' : 'Add New Event'}
            </a>
          </h2>
          <h3> My Hosted Events</h3>
          {message && <p className="message">{message}</p>}
          {loading && <p>Loading...</p>}
          {isFormVisible && (
            <form
              onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
              className="event-form">
              {/* Form fields */}
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Event Title"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Event Description"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event Location"
                required
              />
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                placeholder="Start Time"
                required
              />
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                placeholder="End Time"
                required
              />
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
                required
              />
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleInputChange}
                placeholder="Total Tickets"
                required
              />
              <input
                type="number"
                name="remainingTickets"
                value={formData.remainingTickets}
                onChange={handleInputChange}
                placeholder="Remaining Tickets"
                required
              />
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude"
              />
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude"
              />
              <button type="submit">
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </form>
          )}
          <table className="events-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Location</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Tickets</th>
                <th>Remaining Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{event.location}</td>
                  <td>{event.start_time}</td>
                  <td>{event.end_time}</td>
                  <td>{event.total_tickets}</td>
                  <td>{event.remaining_tickets}</td>
                  <td>
                    <button onClick={() => handleEditClick(event)}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </button>
                    <button onClick={() => handleViewEventDetails(event.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedEvent && <AttendeeList attendees={attendees} />}
        </div>
      </section>
    </div>
  );
}

export default OrganizerDashboard;
