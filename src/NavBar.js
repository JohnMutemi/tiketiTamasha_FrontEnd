import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ticket_11785924.png';

function NavBar({ onSearch, searchTerm, categories, onCategoryClick }) {
    const [showCategories, setShowCategories] = useState(false);

    const handleSearchInputChange = (event) => {
        onSearch(event.target.value);
    };

    const toggleCategoriesDropdown = () => {
        setShowCategories(!showCategories);
    };

    const handleCategorySelect = (category) => {
        onCategoryClick(category);
        setShowCategories(false); // hide after selecting
    };

    return (
        <nav className="navbar">
            <div className="logo">Tiketi Tamasha</div>
            <div className="search-bar">
                <button className="category-dropdown" onClick={toggleCategoriesDropdown}>☰</button>
                {showCategories && (
                    <div className="categories-dropdown">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="category-item"
                                onClick={() => handleCategorySelect(category)}
                            >
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
            <button className="my-events-button">My Events</button>
            <Link to="/account">
                <button className="account-icon">👤</button>
            </Link>
        </nav>
    );
}

export default NavBar;
