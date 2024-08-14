import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import Logout from './Logout';
import ticket from './ticket_11785924.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

const NavBar = ({
  showLogin = true,
  onSearch,
  searchTerm,
  categories,
  onCategoryClick,
  showSearchbar = true, 
}) => {
  const { isAuthenticated } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSearchInputChange = (event) => {
    onSearch(event.target.value);
  };

  const toggleCategoriesDropdown = () => {
    setShowCategories(!showCategories);
  };

  const handleCategorySelect = (category) => {
    onCategoryClick(category);
    setShowCategories(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="left-section">
            <img src={ticket} alt="ticket" className="ticket" />
            <div className="logo">Tiketi Tamasha</div>
          </div>
          {showSearchbar && ( // conditionally render the search bar
            <div className="search-bar">
              <button
                className="category-dropdown"
                onClick={toggleCategoriesDropdown}>
                ☰
              </button>
              {showCategories && (
                <div className="categories-dropdown">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="category-item"
                      onClick={() => handleCategorySelect(category)}>
                      {category}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <button className="search-button">🔍</button>
            </div>
          )}
          <div className="header__menu">
            <ul className="header__menu-items">
              <li className="header__menu-item">
                <a href="/">Home</a>
              </li>

              <li className="header__menu-item">
                <Link to="/contact-us" className="contact-link">
                  <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                  Contact
                </Link>
              </li>
              <li className="header__menu-item"></li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/organizer-dashboard/customer-dashboard">
                      My Dashboard
                    </Link>
                  </li>
                  <li className="profile-container">
                    <div className="profile-icon" onClick={handleProfileClick}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#ffffff" />
                        <path
                          d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div
                      className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                      <Link to="/profile" className="dropdown-item">
                        Profile
                      </Link>
                      <Link to="/update-profile" className="dropdown-item">
                        Update Profile
                      </Link>
                      <div
                        className="dropdown-item logout-button"
                        onClick={() => {
                          handleProfileClick();
                        }}>
                        <Logout />
                      </div>
                    </div>
                  </li>
                </>
              ) : showLogin ? (
                <li className="header__login-btn">
                  <Link to="/login" className="login-btn__text">
                    Login
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
