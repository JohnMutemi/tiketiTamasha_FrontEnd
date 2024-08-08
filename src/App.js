import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AccountDetails from './components/AccountDetails';
import Register from './components/Register';
import SignIn from './components/SignIn';
import OrganizerDashboard from './components/OrganizerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ContactForm from './components/ContactForm'; // Import the ContactForm component

import { UserProvider } from './components/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/contact-us" element={<ContactForm />} />{' '}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
