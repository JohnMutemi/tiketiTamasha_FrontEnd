import React, { useEffect, useState } from 'react';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5555/api/booked-events');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleUpdate = async (eventId) => {
        console.log('Update button clicked for event ID:', eventId);

        const updatedData = {
            image_url: 'http://newimage.com/newimage.jpg',
            name: 'Updated Event Name',
            date: '2024-08-20 18:00:00',
            description: 'Updated description.',
            ticket_type: 'VIP',
            payment_status: 'Verified'
        };

        try {
            const response = await fetch(`http://localhost:5555/api/booked-events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            console.log('Update response:', response);
            if (response.ok) {
                fetchEvents(); // Refresh the events list after updating
            } else {
                console.error('Failed to update the event');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (eventId) => {
        console.log('Delete button clicked for event ID:', eventId);

        try {
            const response = await fetch(`http://localhost:5555/api/booked-events/${eventId}`, {
                method: 'DELETE'
            });
            console.log('Delete response:', response);
            if (response.ok) {
                setEvents(events.filter(event => event.id !== eventId)); // Remove the deleted event from the state
            } else {
                console.error('Failed to delete the event');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard-container">
            <h2>Your Booked Events</h2>
            <div className="events-list">
                {events.map(event => (
                    <div className="event-card" key={event.id}>
                        <img src={event.image_url} alt={event.name} className="event-image" />
                        <div className="event-details">
                            <h3>{event.name}</h3>
                            <p>{event.date}</p>
                            <p>{event.description}</p>
                            <p>Ticket Type: {event.ticket_type}</p>
                            <p>Payment Status: {event.payment_status}</p>
                            <button onClick={() => handleUpdate(event.id)}>Update</button>
                            <button onClick={() => handleDelete(event.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerDashboard;
