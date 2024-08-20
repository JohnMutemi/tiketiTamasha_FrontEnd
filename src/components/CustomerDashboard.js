import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import TicketModal from './TicketModal';
import EventList from './EventList';
import Logout from './Logout';
import NavBar from './NavBar';
import CalendarComponent from './CalendarComponent';
import './CustomerDashboard.css';

function CustomerDashboard() {
  const { user, token, selectedTicket } = useUser();
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [areEventsVisible, setAreEventsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const fetchPurchasedTickets = useCallback(async () => {
    try {
      const response = await fetch(
        `https://tiketi-tamasha-backend-1.onrender.com/tickets?user_id=${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tickets.');
      }
      const data = await response.json();
      setPurchasedTickets(data);
    } catch (error) {
      console.error('Error fetching purchased tickets:', error);
    }
  }, [user.user_id, token]);

  useEffect(() => {
    if (user && token) {
      fetchPurchasedTickets();
    }
  }, [user, token, fetchPurchasedTickets]);

  useEffect(() => {
    if (areEventsVisible) {
      fetchEvents();
    }
  }, [areEventsVisible]);

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://tiketi-tamasha-backend-1.onrender.com/events'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch events.');
      }
      const data = await response.json();
      setEvents(data);
      setError('');
    } catch (error) {
      setError('Error fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTicketModal = () => {
    setIsTicketModalOpen(!isTicketModalOpen);
  };

  const toggleEventsVisibility = () => {
    setAreEventsVisible(!areEventsVisible);
  };

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleEventSelect = (date) => {
    console.log('Selected Date: ', date);
  };

  return (
    <div className="customer-dashboard">
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
        <div className="my-tickets">
          <h2>My Booked Tickets</h2>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Event Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {purchasedTickets.length > 0 ? (
                purchasedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.event.title}</td>
                    <td>${parseFloat(ticket.price).toFixed(2)}</td>
                    <td>{ticket.status}</td>
                    <td>
                      <button
                        onClick={toggleCalendarVisibility}
                        className="calendar-link-button">
                        Add to calendar
                        <i className="fas fa-calendar-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No purchased tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="upcoming-events">
          <h2>
            <button
              onClick={toggleEventsVisibility}
              className="event-toggle-button">
              Click here to Book a new Event
            </button>
          </h2>
          {areEventsVisible && (
            <>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p>{error}</p>
              ) : filteredEvents.length > 0 ? (
                <EventList events={filteredEvents} />
              ) : (
                <p>No events found</p>
              )}
            </>
          )}
        </div>
      </section>

      {isTicketModalOpen && (
        <TicketModal tickets={[selectedTicket]} onClose={toggleTicketModal} />
      )}

      {isCalendarVisible && (
        <section className="calendar-section">
          <CalendarComponent onEventSelect={handleEventSelect} />
        </section>
      )}
    </div>
  );
}

export default CustomerDashboard;
