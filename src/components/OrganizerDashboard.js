import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import Logout from './Logout';
import NavBar from './NavBar';
import AttendeeList from './AttendeeList';
import './OrganizerDashboard.css';

const OrganizerDashboard = ({ eventId }) => {
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

  // Fetch events with useCallback to handle dependency issues
  const fetchEvents = useCallback(async () => {
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
      const cachedEvents = localStorage.getItem('events');
      if (cachedEvents) {
        setEvents(JSON.parse(cachedEvents));
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchEvents();
    }
  }, [user, token, fetchEvents]);

  const getCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
    return { latitude: '', longitude: '' }; // Default if not found
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === 'location') {
        getCoordinates(value).then(({ latitude, longitude }) => {
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        });
      }

      return newData;
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/organizer-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_time: formData.startTime,
          end_time: formData.endTime,
          image_url: formData.imageUrl,
          total_tickets: formData.totalTickets,
          remaining_tickets: formData.remainingTickets,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add event');
      }

      const newEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, newEvent.event]);
      clearForm();
      setMessage('Event added successfully!');
    } catch (error) {
      setMessage(`Error adding event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
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

  const handleViewAttendees = (eventId) => {
    console.log(`View Attendees clicked for event ID: ${eventId}`);
    setSelectedEvent(eventId);
    fetchEventAttendees(eventId);
  };

  // Fetch event attendees with useCallback to handle dependency issues
  const fetchEventAttendees = useCallback(
    async (eventId) => {
      setLoading(true);
      setAttendees([]);
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

        if (data.attendees && data.attendees.length === 0) {
          setMessage('Attendees not found.');
        }
      } catch (error) {
        setMessage('Error fetching attendees');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (eventId && token) {
      fetchEventAttendees(eventId);
    }
  }, [eventId, token, fetchEventAttendees]);

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
            <button
              onClick={(e) => {
                e.preventDefault();
                setFormVisible((prev) => !prev);
              }}
              className="link-button">
              {isFormVisible ? 'Cancel' : 'Add New Event'}
            </button>
          </h2>

          <h3> My Hosted Events</h3>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {message && <p>{message}</p>}
          {isFormVisible && (
            <div className="event-management">
              <form
                onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Location:
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Start Time:
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Image URL:
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Total Tickets:
                  <input
                    type="number"
                    name="totalTickets"
                    value={formData.totalTickets}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Remaining Tickets:
                  <input
                    type="number"
                    name="remainingTickets"
                    value={formData.remainingTickets}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <button type="submit">
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button type="button" onClick={clearForm}>
                  Cancel
                </button>
              </form>
            </div>
          )}
          <table>
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
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="delete-button">
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewAttendees(event.id)}
                      className="attendees-button">
                      View Attendees
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="event-attendees">
        {selectedEvent && attendees.length > 0 && (
          <div>
            <h3>Attendees for Event ID: {selectedEvent}</h3>
            <AttendeeList attendees={attendees} />
          </div>
        )}
      </section>
    </div>
  );
};

export default OrganizerDashboard;
