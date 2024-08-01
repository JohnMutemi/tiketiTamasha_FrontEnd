import React from 'react';

function EventList({ events }) {
  return (
    <div className="event-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
}

export default EventList;