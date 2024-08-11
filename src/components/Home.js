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

  const toggleLogin = () => {
    if (userIsLoggedIn) {
      onLogout();
    } else {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await fetch('http://127.0.0.1:5555/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          'http://127.0.0.1:5555/categories',
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
          <a href="#" onClick={handleToggleEvents}>
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
          <a href="#">About us</a>
          <a href="#">Help</a>
          <a href="#">Customer Service</a>
          <a href="#">Download the Tiketi Tamasha app</a>
        </div>
        <div className="footer-right">
          <img
            src="data:image/jpeg;base64,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"
            alt="App Store"
          />
          <img
            src="data:image/jpeg;base64,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"
            alt="Instagram"
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEU7V53///8gRZUyUZrn6vKKl785VZxAW6Dh5O5yg7QmSZbR1uUxUJojR5Y2U5vx8vdbcKqyutSXosVidq3a3urM0uPCyd6ps9B7i7n09vrx9Pm4wNikrs1MZKRYbqp/j7tqfbGapsiPnMIAMY0VP5JdM9iBAAAD+UlEQVR4nO3dbVOjMBSG4fDSUEISXtRatta67v7/37hF7eiMs5iKyTmHee4Zx08i13RIhACq7K1mqCu1lqp6aC4w9fqtr5z1mnrHfiztrav6D8K2M+vRXdKmay/CsiiodydKRVG+ClvrqfclUt62L8JunZ/gVNFNwt5Q70fETH8WVusbZN7TVaYaR70XUXONGiz1TkTNDqpe60D6mq/Vqg/D6UCk3gOEEEIIIYQQQgghhMjz1hr3ofz8ZZwxxlpbFFr2NUJ9tvmbzf2u2ZbjmGXZOI6/2rLc3jZ3u0P/MGz2N0dtnZPJ9NYdN7sy+7p2q+QRtc0f70N0b0vY0tLGDuE8eUJtdH8NT5zQ2vsrfbKEOj+NVwMlCQvffO2RLDRP3/EJEubD94BihPm1Q6g0Yb77LlCIcAFQhtBdPwvKEprNAqAEoX9cAhQg1KZdudB9e54QIvTdMiB/Yb5dubA4LQSyF7qrzucFCpd/hNyFi49C7kK9dCBlLzSH1QuXA3kLi/3ahWbBaaEMoVv2Nzd/4cLTJgFC+3ydpd3eNp+65bz2dMVhOB5ORzstjX6OMVC50D9otntnJK74ahsIHHKhDw/qYxjwRuyzg0UdBKzlPncWNpQeBD86GLYaKvQQfCnoxOIg9iA8Z+4ChE+Sn410IUu+Vt4s+F7IhL8VPM6ECXeSD0OVB1xIvJc7Gaow4e/VC59XL9xInvAhhFBAEELIPwgh5B+EEPIPQgj5ByGE/INQhlD/vzChndnCy1aoq2YyIUI9t4UpWqMPW+VdUkl72T9wHXtJd6sX9rQXxRMIid+fm0C4p51OEggfaVfBEwiJl/njC0fiVfD4Qup1/vhC6nX++ELqdf74QupV8PhC6lum4guPxKdP8YXUd3lHF7bUN4VFF96uXkg9HcYXPlDfMhVdSH4pLrrwhvoO4uhC8v+uEls4Ug800YUl9WQRXdis/jOkfxgjtpD+HunYwj31ZBFd2FFPFtGF1L7oQvrpMLaQ+lJifCHxytqUfyq3MwUg5n6+JD93mohupj8Bq9ynvzMbYACcbx33YswFIYT8gxBC/kEIIf8ghJB/EELIPwgh5B+EEPIPQgj5ByGE/IMQQv5BCCH/IISQfxBCyD8IIeQfhBDyD0II+QchhPyDEEL+QQgh/yCEkH8QQsg/CCHkH4QQ8g9CCPmXUEj01rNUQl2pmuZlRKmEvlZE76ZPJbSDamjeZJNK6BpF9PrBREJdZSrrSV7Wk0ho+rMw6yimnTTCossmYWsJhtMkQm/bF2FW2vSfYgphYadfMgmztkv+auz4Qm26NrsIs6yvnPUplXGF2ltX9a9bUZfNNUNd/SThi+IKq3poLlv5B3kiS8fmdy97AAAAAElFTkSuQmCC"
            alt="Facebook"
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEVHqej///83pOc/pudCp+gzo+ff7/vx+P32+/6Nx/CFw+/0+v7H4/duuew+p+fr9fxPrel4ve1aseq+3/av1/SdzvHS6Plmteuz2fSo0/Pc7vrO5viYzPHm8vvG4veGxO8cXmsdAAAFAklEQVR4nO3c67ayIBAGYBvwWCJqZger+7/LD3fHXVpiuKFvvc+v/tSaCYQZ0jwPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4eFwq3HcVUOCOvqOu0LiSRsB2NeUT5ZptFs1YYrI8edQ/llw4wJ7kOZ79Eh9R/zoaJ9CtTJHmYdQjSh3Fk7Dg/WsyQs7Hvq6KuBJVS3q5HTiLezzKLFyjPlzTmfcLb9uTXXpHp+TMZyU07j5uRX6MJtJrFI1JkRdifoBIT50Rec/oaQosJilQFkGsHwNK+GXrRyHx5HeXE5hCWsxEp8uJdgmpVvb1cjLoODKGfQKJaL0Xxeoo+CCeKfRCenqPQSpF2OgnOapuVDttcwsiHzyQWayWYtl8eJ6+eLo0X7kYjGZyi1JqjKkHO/GKTpVaG0s9uoVT+sPfcxn2ArPBJpbdXH29nuaH7aMphDZB4v47ePtKrq928fbUY+P0Z9yuebTFgvdG5CqPg8iqwtdrIh4gGrDf+aniGV6G0Vnk/hlKKt1/2iASjwtqGwZ6Cyd4Mo0hGJKhZUJjkz5/jKeWreNhSP8HUbmfxbN68OG/RrGeU0OIIqnjX3UElrC8qyjrf0S+we0Yj8r64jj05Ms0MS2b5hOZ5qbnYx6Lz3EyrZLNVydx5dVlFa0nPI6CXYW79BJX3TdOToFJJ/gqS6WWYWM/Q48GbGLeblN1l6e+1Mjzaz5Ad34cZ7iqVJbF2ytJCK0MHxtCjF6eC9/aHZZxKj3R6J3UdOnDWLQqtkKOOKsjxDD1qtGLWY/WM5up0ojiNwvoY/ux3+rXmUJHt/Hi+SttNnektkMPNbZ1dXLRn+kHVHhZ1V+AfC2xnyE/raFZWeTVJhlbP83/0F95mbGy2hj+0uz1N9os26vyd2hwHNgu9nyC02V5oWpMmuLW+0PQcRRmztL7QvO2AP+RE3S3edcAfsF6z/WAjzrCHWjlwGXpTlt1W76K5w+X7UEeyvxuesKkWm8CNSarQNFX3rHJjkrZI//ekIaTtvO5MMoo7F0q2K0o0bj8YyInt/oYVpsu3zJl15kxQYrZXdGiduRB+MvD4e4i57XQeEVPIl7GpCmfcncfTEbtl1cTNZr01NFUjl7aKlvE20bUhNN4mRg4uM2bbREe6intm28S99UPEDkbbRPv3J3Tg0lzdVrq2zJyYaxPnru0UF8YaDP0HVP6K5k0IfUqnuqbfjIzi3nYWL5GBPaN2qy18xOSn5dvR2YvwjPuJ3m1dDzYOX4QXjCXjx9H+r9qDCJLNQu8WxLOV61P0iqtmmIpc7wav2Wxr+35gPX6im+D+q566Z0z7F/7Ac7He7iHoqF2Hb78oQUG5/qHboefvIhzEKB+xW6y/Y5toH2aleMx5xphH+v+e2iJEWo7pg7Mhzy1axblgxIr4MO6w1PpjMX2Kgvk+qa3dK9J4sxt7FDwf/oj0X5OlCi8Lo8/OZw7C4Rnqpx8fkgap270Ep/ijVimL3d8EmWhG/xQTNp7DE/SGUTJqru5j+or8WsJPS802Ilqk/tfk1+IkY41KbdtI96+/J0wluRuyb+xi2fuMsOtUX19vdi9OL8JFVfvfc/V1UsUbFUm1Xu2z+XVAozALFssml37HM7PfiPP2YUpPtv+FmNZ1XRRSnJ+u/M+0/2fJ/+e/tAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABw2D9CmzsMT+QcxQAAAABJRU5ErkJggg=="
            alt="Twitter"
          />
        </div>
      </footer>
    </div>
  );
}

export default Home;
