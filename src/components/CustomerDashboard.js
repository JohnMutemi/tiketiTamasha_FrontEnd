import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import TicketModal from './TicketModal';
import EventList from './EventList';
import Logout from './Logout';
import './CustomerDashboard.css';
import NavBar from './NavBar';

function CustomerDashboard() {
  const { user, token, selectedTicket, logout } = useUser();
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [areEventsVisible, setAreEventsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchPurchasedTickets();
    }
  }, [user, token]);

  useEffect(() => {
    if (areEventsVisible) {
      fetchEvents();
    }
  }, [areEventsVisible]);

  useEffect(() => {
    if (events.length > 0) {
      setFilteredEvents(
        events.filter((event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, events]);

  const fetchPurchasedTickets = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/tickets?user_id=${user.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPurchasedTickets(data);
    } catch (error) {
      console.error('Error fetching purchased tickets:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/events');
      if (!response.ok) {
        throw new Error('Network response was not ok');
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

  const handleLogout = () => {
    logout();
  };

  const handleTicketModalOpen = () => {
    if (selectedTicket) {
      setIsTicketModalOpen(true);
    }
  };

  const handleTicketModalClose = () => {
    setIsTicketModalOpen(false);
  };

  const handleToggleEvents = () => {
    setAreEventsVisible(!areEventsVisible);
  };

  return (
    <div className="customer-dashboard">
      <NavBar showLogin={false} showSearchbar={false} />
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
            <thead >
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
                      <button onClick={handleTicketModalOpen}>
                        View Ticket
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
            <a href="#" onClick={handleToggleEvents}>
              Click here to Book a new Event
            </a>
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
        <TicketModal
          tickets={[selectedTicket]}
          onClose={handleTicketModalClose}
        />
      )}
    </div>
  );
}

export default CustomerDashboard;
