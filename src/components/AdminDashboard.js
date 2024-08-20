import React from 'react';
import UserManagement from './UserManagement';
import { useUser } from './UserContext';
import EventManagement from './EventManagement';
import TransactionList from './TransactionList';
import CategoryManagement from './CategoryManagement';
import NavBar from './NavBar';
import Logout from './Logout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useUser();
  return (
    // <div className="admin-dashboard">
    //   <NavBar showLogin={false} showSearchbar={false} />
    //   <div className="dashboard-header">
    //     <h1>Welcome, {user ? user.username : 'Admin'}</h1>
    //     <div className="profile-menu">
    //       <i className="fas fa-user profile-icon"></i>
    //       <div className="dropdown">
    //         <div className="dropdown-content">
    //           <Logout />
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <main className="dashboard-main">
    //     <div className="dashboard-section">
    //       <CategoryManagement />
    //     </div>
    //     <div className="dashboard-section">
    //       <EventManagement />
    //     </div>
    //     <div className="dashboard-section">
    //       <UserManagement />
    //     </div>
    //     <div className="dashboard-section">
    //       <TransactionList />
    //     </div>
    //   </main>
    // </div>
    <div className="dashboard-container">
      <NavBar showLogin={false} showSearchbar={false} />
      <div className="dashboard-header">
        <h1>Welcome, {user ? user.username : 'Admin'}</h1>
        <div className="profile-menu">
          <i className="fas fa-user profile-icon"></i>
          <div className="dropdown">
            <div className="dropdown-content">
              <Logout />
            </div>
          </div>
        </div>
      </div>
      <main className="dashboard-main">
        <div className="dashboard-section">
          <CategoryManagement />
        </div>

        <div className="dashboard-section">
          <EventManagement />
        </div>

        <div className="dashboard-section">
          <UserManagement />
        </div>

        <div className="dashboard-section">
          <TransactionList />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
