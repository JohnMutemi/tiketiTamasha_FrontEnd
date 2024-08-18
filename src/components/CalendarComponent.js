import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarComponent = ({ onEventSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState([]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onEventSelect) onEventSelect(date);
    console.log('Selected Date:', date.toDateString());
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
    console.log('Event Name:', event.target.value);
  };

  const handleCreateEvent = () => {
    if (selectedDate && eventName) {
      const newEvent = {
        id: new Date().getTime(),
        date: selectedDate,
        title: eventName,
      };
      console.log('Adding new event:', newEvent);
      setEvents([...events, newEvent]);
      console.log('Updated list of events:', [...events, newEvent]);
      setEventName('');
      setSelectedDate(null);
    }
  };

  const handleUpdateEvent = (eventId, newName) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        console.log(
          `Updating event ID ${eventId} from '${event.title}' to '${newName}'`
        );
        return { ...event, title: newName };
      }
      return event;
    });
    setEvents(updatedEvents);
    console.log('Updated events after edit:', updatedEvents);
  };

  const handleDeleteEvent = (eventId) => {
    console.log(`Deleting event ID ${eventId}`);
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    console.log('Updated events after deletion:', updatedEvents);
  };

  return (
    <div className="calendar-container">
      <h2>Event Calendar</h2>
      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileClassName={({ date }) =>
          events.some(
            (event) => event.date.toDateString() === date.toDateString()
          )
            ? 'event-marked'
            : ''
        }
      />
      {selectedDate && (
        <div className="event-form">
          <h2>Create Event</h2>
          <p>Selected Date: {selectedDate.toDateString()}</p>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={handleEventNameChange}
          />
          <button onClick={handleCreateEvent}>Add Event</button>
        </div>
      )}
      <div className="event-list">
        {events.length > 0 && (
          <>
            <h2>My Events</h2>
            <div className="event-cards">
              {events.map((event) =>
                event.date.toDateString() === selectedDate?.toDateString() ? (
                  <div key={event.id} className="event-card">
                    <div className="event-card-header">
                      <span className="event-date">
                        {event.date.toDateString()}
                      </span>
                      <div className="event-actions">
                        <button
                          onClick={() =>
                            handleUpdateEvent(
                              event.id,
                              prompt('Enter new title', event.title) ||
                                event.title
                            )
                          }>
                          Update Event
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)}>
                          Delete Event
                        </button>
                      </div>
                    </div>
                    <div className="event-card-body">
                      <p className="event-title">{event.title}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
