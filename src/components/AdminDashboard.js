import React from 'react';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
// import Notifications from './Notifications';

const AdminDashboard = () => {
  return (
    <div>
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <main>
        <UserManagement />
        <EventManagement />
        {/* <Notifications /> */}
      </main>
    </div>
  );
};

export default AdminDashboard;
