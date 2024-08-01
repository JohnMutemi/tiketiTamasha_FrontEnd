import React from 'react';

function NavBar({ onSearch, searchTerm }) {

  const handleSearchInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <nav className="navbar">
      <div className="logo">Tiketi Tamasha</div>
      <div className="search-bar">
        <button className="category-dropdown">☰</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <button className="search-button">🔍</button>
      </div>
      <button className="my-events-button">My Events</button>
      <button className="account-icon" >👤</button>
    </nav>
  );
}

export default NavBar;

  
  

  

  

