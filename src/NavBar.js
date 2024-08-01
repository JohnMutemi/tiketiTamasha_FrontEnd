import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function NavBar({ onSearch, searchTerm, categories, onCategoryClick }) {
    const [showAccountDetails, setShowAccountDetails] = useState(false);

    const handleSearchInputChange = (event) => {
        onSearch(event.target.value);
    };

    const handleCategoryClick = (event) => {
        onCategoryClick(event.target.value);
    }

    return (
        <nav className="navbar">
            <div className="logo">Tiketi Tamasha</div>
            <div className="search-bar">
                <button className="category-dropdown" onClick={handleCategoryClick}>☰</button>
                <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                />
                <button className="search-button">🔍</button>
            </div>
            <button className="my-events-button">My Events</button>
            <Link to="/account">
                <button className="account-icon">👤</button>
            </Link>
        </nav>
    );
}

export default NavBar;

  
  

  

  

