import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './EventManagement.css';

const EventManagement = () => {
  const { token } = useUser();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
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
  const [isFormVisible, setFormVisible] = useState(() => {
    return JSON.parse(localStorage.getItem('isFormVisible')) || false;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      console.log('Fetching events...');
      try {
        const response = await fetch('http://127.0.0.1:5555/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log('Events fetched:', data);
        setEvents(data);
        localStorage.setItem('events', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching events:', error);
        setMessage('Error fetching events');
        const cachedEvents = localStorage.getItem('events');
        if (cachedEvents) {
          console.log('Loading cached events:', JSON.parse(cachedEvents));
          setEvents(JSON.parse(cachedEvents));
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

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
        // Fetch coordinates when location is updated
        getCoordinates(value).then(({ latitude, longitude }) => {
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        });
      }

      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    console.log('Adding event:', formData);
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/events', {
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
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      console.log('Event added:', newEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent.event]);
      clearForm();
      setMessage('Event added successfully!');
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage('Error adding event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    console.log('Updating event:', formData);
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/events/${editingEvent}`,
        {
          method: 'PATCH',
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
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      console.log('Event updated:', updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === editingEvent ? { ...ev, ...updatedEvent.event } : ev
        )
      );
      clearForm();
      setMessage('Event updated successfully!');
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage('Error updating event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    console.log(`Deleting event with ID: ${eventId}`);
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter((event) => event.id !== eventId));
      setMessage('Event deleted successfully!');
      localStorage.setItem(
        'events',
        JSON.stringify(events.filter((event) => event.id !== eventId))
      );
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (event) => {
    console.log('Editing event:', event);
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
    localStorage.setItem('isFormVisible', JSON.stringify(true));
  };

  const clearForm = () => {
    console.log('Clearing form');
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
    localStorage.setItem('isFormVisible', JSON.stringify(false));
  };

  return (
    <div className="event-management">
      <h2>Manage Events</h2>
      <button
        className="toggle-form-button"
        onClick={() => setFormVisible((prev) => !prev)}>
        {isFormVisible ? 'Hide Form' : 'Add New Event'}
      </button>
      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}
      {isFormVisible && (
        <form
          onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
          className="event-form">
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
          <div>
            <input
              type="datetime-local"
              name="startTime"
              value={formatDate(formData.startTime)}
              onChange={handleInputChange}
              placeholder="Start Time"
              required
            />
            <input
              type="datetime-local"
              name="endTime"
              value={formatDate(formData.endTime)}
              onChange={handleInputChange}
              placeholder="End Time"
              required
            />
          </div>
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
          <button type="submit">
            {editingEvent ? 'Update Event' : 'Add Event'}
          </button>
        </form>
      )}
      <div className="table-container">
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
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{event.location}</td>
                  <td>{new Date(event.start_time).toLocaleString()}</td>
                  <td>{new Date(event.end_time).toLocaleString()}</td>
                  <td>{event.total_tickets}</td>
                  <td>{event.remaining_tickets}</td>
                  <td>
                    <button onClick={() => handleEditClick(event)}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No events available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManagement;
