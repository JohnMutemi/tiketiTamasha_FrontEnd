import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AccountDetails from './AccountDetails';
import'./home.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;