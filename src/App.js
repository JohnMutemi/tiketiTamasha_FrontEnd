import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AccountDetails from './AccountDetails';
import'./home.css'
import Register from './components/Register';
import SignIn from './components/SignIn';
import OrganizerDashboard from './components/OrganizerDashboard'; 

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
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;