import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactForm.css';
import ticket from './ticket_11785924.png';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5555/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Thank you for reaching TiketiTamasha!');
      } else {
        console.error('Failed to send feedback');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset the form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleTicketClick = () => {
    navigate('/');
  };

  return (
    <div className="contact-form-container">
      <img
        src={ticket}
        alt="ticket"
        className="ticket"
        onClick={handleTicketClick}
        style={{ cursor: 'pointer' }} // Makes the cursor a pointer when hovering over the ticket
      />
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

