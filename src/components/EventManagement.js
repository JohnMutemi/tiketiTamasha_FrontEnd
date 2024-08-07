import React, { useState, useEffect } from 'react';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [remainingTickets, setRemainingTickets] = useState('');
  const [isFormVisible, setFormVisible] = useState(false); // State to toggle form visibility

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5555/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          image_url: imageUrl,
          total_tickets: totalTickets,
          remaining_tickets: remainingTickets,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      clearForm();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          image_url: imageUrl,
          total_tickets: totalTickets,
          remaining_tickets: remainingTickets,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedEvent = await response.json();
      setEvents(
        events.map((event) => (event.id === eventId ? updatedEvent : event))
      );
      clearForm();
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setStartTime(event.start_time);
    setEndTime(event.end_time);
    setImageUrl(event.image_url);
    setTotalTickets(event.total_tickets);
    setRemainingTickets(event.remaining_tickets);
    setFormVisible(true); // Show the form when editing
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    setImageUrl('');
    setTotalTickets('');
    setRemainingTickets('');
    setFormVisible(false); // Hide the form when cleared
  };

  return (
    <div className="event-management">
      <h2>Manage Events</h2>

      <button
        className="toggle-form-button"
        onClick={() => setFormVisible(!isFormVisible)}
      >
        {isFormVisible ? 'Hide Form' : 'Add New Event'}
      </button>

      {isFormVisible && (
        <form
          onSubmit={
            editingEvent ? () => handleUpdateEvent(editingEvent) : handleAddEvent
          }
          className="event-form"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Event Location"
            required
          />
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start Time"
            required
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="End Time"
            required
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            required
          />
          <input
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            placeholder="Total Tickets"
            required
          />
          <input
            type="number"
            value={remainingTickets}
            onChange={(e) => setRemainingTickets(e.target.value)}
            placeholder="Remaining Tickets"
            required
          />
          <button type="submit">{editingEvent ? 'Update Event' : 'Add Event'}</button>
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
            {events.map((event) => (
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
                  
                  <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManagement;
