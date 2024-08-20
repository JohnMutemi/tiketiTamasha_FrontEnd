import React, { useState, useEffect, useMemo } from 'react';
import NavBar from './NavBar';
import { useUser } from './UserContext';
import EventList from './EventList';
import './home.css';

function Home() {
  const { user, onLogout, token } = useUser();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [areEventsVisible, setAreEventsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userIsLoggedIn = !!user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await fetch(
          'https://tiketi-tamasha-backend-1.onrender.com/events',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!eventsResponse.ok) {
          throw new Error(`HTTP error! Status: ${eventsResponse.status}`);
        }
        const eventsData = await eventsResponse.json();

        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
          setFilteredEvents(eventsData);
        } else {
          console.error('Unexpected events data format:', eventsData);
        }

        const categoriesResponse = await fetch(
          'https://tiketi-tamasha-backend-1.onrender.com/categories',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        setError('Error fetching data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterEvents(term, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterEvents(searchTerm, category);
  };

  const filterEvents = (term, category) => {
    let filtered = events;
    if (term) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }
    setFilteredEvents(filtered);
  };

  const memoizedFilteredEvents = useMemo(
    () => filteredEvents,
    [filteredEvents]
  );

  const handleToggleEvents = () => {
    setAreEventsVisible((prevVisible) => !prevVisible);
  };
  const handleClick = (event) => {
    event.preventDefault(); // Prevent the default behavior of the link
    console.log('Link clicked: A Glimpse of Upcoming Events');
    handleToggleEvents(); // Call the existing event handler
    console.log('handleToggleEvents function called');
  };

  return (
    <div className="home">
      <NavBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        categories={categories}
        onCategoryClick={handleCategoryClick}
        isAuthenticated={userIsLoggedIn}
        onLogout={onLogout}
      />
      <div className="hero-section">
        <div className="hero-image">
          <div className="hero-text">Craft the Next Big Experience</div>
        </div>

        <div className="register-section">
          <p className="description">
            Transform your event experience with Tiketi Tamasha—our intuitive
            platform ensures that booking tickets is quick, easy, and
            hassle-free.
          </p>
          <a href="/register" className="get-started-button">
            Get Started for Free
          </a>
        </div>
      </div>
      <div className="events-section">
        <h2>
          <a href="/" onClick={handleClick}>
            A Glimpse of Upcoming Events
          </a>
        </h2>
        {areEventsVisible && (
          <>
            {loading ? (
              <p>Loading events...</p>
            ) : error ? (
              <p>{error}</p>
            ) : memoizedFilteredEvents.length > 0 ? (
              <EventList events={memoizedFilteredEvents} />
            ) : (
              <p>No events found</p>
            )}
          </>
        )}
      </div>
      <footer>
        <div className="footer-left">
          <p>&copy; 2024 Tiketi Tamasha. All rights reserved.</p>
        </div>

        <div className="footer-center">
          <a href="/">About us</a>
          <a href="/">Help</a>
          <a href="/">Customer Service</a>
          <a href="/">Download the Tiketi Tamasha app</a>
        </div>
        <div className="footer-right">
          <img
            src="data:image/jpeg;base64,..."
            alt="Tiketi Tamasha"
            style={{ width: '100px' }}
          />
        </div>
      </footer>
    </div>
  );
}

export default Home;
