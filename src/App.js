import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import SignIn from './components/SignIn';
import OrganizerDashboard from './components/OrganizerDashboard'; 

import { UserProvider } from './components/UserContext'; 

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
