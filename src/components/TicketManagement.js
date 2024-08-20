import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './ticket-management.css';

const TicketManagement = ({ eventId, eventDate }) => {
  const { token } = useUser();
  const [tickets, setTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    ticketType: 'Regular', // Default to Regular
    eventId: eventId,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://tiketi-tamasha-backend-1.onrender.com/tickets?eventId=${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setMessage('Error fetching tickets');
      } finally {
        setLoading(false);
      }
    };

    if (token && eventId) {
      fetchTickets();
    }
  }, [token, eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the ticket type is Early Bird and if the event date is within the valid range
    if (formData.ticketType === 'Early Bird') {
      const eventDateObj = new Date(eventDate);
      const currentDate = new Date();
      const expirationDate = new Date(eventDateObj);
      expirationDate.setDate(expirationDate.getDate() - 7);

      if (currentDate > expirationDate) {
        setMessage(
          'Early Bird tickets cannot be added after the expiration date.'
        );
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        'https://tiketi-tamasha-backend-1.onrender.com/tickets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add ticket');
      }

      const newTicket = await response.json();
      setTickets((prevTickets) => [...prevTickets, newTicket]);
      clearForm();
      setMessage('Ticket added successfully!');
    } catch (error) {
      console.error('Error adding ticket:', error);
      setMessage('Error adding ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://tiketi-tamasha-backend-1.onrender.com/tickets/${editingTicket}`,
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
        throw new Error('Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === editingTicket ? updatedTicket : ticket
        )
      );
      clearForm();
      setMessage('Ticket updated successfully!');
    } catch (error) {
      console.error('Error updating ticket:', error);
      setMessage('Error updating ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://tiketi-tamasha-backend-1.onrender.com/tickets/${ticketId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
      setMessage('Ticket deleted successfully!');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setMessage('Error deleting ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ticket) => {
    setEditingTicket(ticket.id);
    setFormData({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      quantity: ticket.quantity,
      ticketType: ticket.ticketType,
      eventId: eventId,
    });
  };

  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      ticketType: 'Regular', // Reset to default
      eventId: eventId,
    });
    setEditingTicket(null);
  };

  return (
    <div className="ticket-management">
      <h2>Manage Tickets</h2>
      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={editingTicket ? handleUpdateTicket : handleAddTicket}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ticket Name"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Ticket Description"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Ticket Price"
          required
        />
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          placeholder="Ticket Quantity"
          required
        />
        <select
          name="ticketType"
          value={formData.ticketType}
          onChange={handleInputChange}>
          <option value="Regular">Regular</option>
          <option value="Early Bird">Early Bird</option>
          <option value="VIP">VIP</option>
        </select>
        <button type="submit">
          {editingTicket ? 'Update Ticket' : 'Add Ticket'}
        </button>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.name}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.price}</td>
                  <td>{ticket.quantity}</td>
                  <td>{ticket.ticketType}</td>
                  <td>
                    <button onClick={() => handleEditClick(ticket)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTicket(ticket.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No tickets available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketManagement;
