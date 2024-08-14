import React from 'react';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import TransactionList from './TransactionList';
import CategoryManagement from './CategoryManagement';
import NavBar from './NavBar';
import Logout from './Logout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <NavBar showLogin={false} showSearchbar={false} />
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="profile-menu">
          <i className="fas fa-user profile-icon"></i>
          <div className="dropdown">
            <div className="dropdown-content">
              <Logout />
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-section">
          <CategoryManagement />
        </div>
        <div className="dashboard-section">
          <UserManagement />
        </div>
        <div className="dashboard-section">
          <TransactionList />
        </div>
        <div className="dashboard-section">
          <EventManagement />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
