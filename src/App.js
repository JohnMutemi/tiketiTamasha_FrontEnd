import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AccountDetails from './components/AccountDetails';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import OrganizerDashboard from './components/OrganizerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';
import InitiateTransaction from './components/InitiateTransaction';
import { UserProvider } from './components/UserContext';
import TicketManagement from './components/TicketManagement';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/contact-us" element={<ContactForm />} />
          <Route path="/tickets" component={TicketManagement} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/initiate-transaction"
            element={<InitiateTransaction />}
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
