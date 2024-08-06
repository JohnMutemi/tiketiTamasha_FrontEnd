import React, { useState, useEffect } from 'react';
import './EventList.css';

function AdminEventList() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/admin/events')
        .then(response => response.json())
        .then(data => setEvents(data))
        .catch(error => console.error('Error fetching events:', error));
    }, []);

    const handleEditClick = (event) => {
        setSelectedEvent(event);
    };

    const handleApproveClick = (eventId) => {
        fetch(`/api/admin/events/${eventId}/approve`, {
        method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event approved:', data);
        })
        .catch(error => console.error('Error approving event:', error));
    };

    const handleDeactivateClick = (eventId) => {
        fetch(`/api/admin/events/${eventId}/deactivate`, {
        method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event deactivated:', data);
        })
        .catch(error => console.error('Error deactivating event:', error));
    };

    return (
        <div className="event-list">
        {events.length > 0 ? (
            events.map(event => (
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
                <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
                </p>
                <p>
                <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
                </p>
                <div>
                <button onClick={() => handleEditClick(event)}>Edit</button>
                <button onClick={() => handleApproveClick(event.id)}>Approve</button>
                <button onClick={() => handleDeactivateClick(event.id)}>Deactivate</button>
                </div>
            </div>
            ))
        ) : (
            <p>No events found</p>
        )}
        </div>
    );
};

export default AdminEventList;
