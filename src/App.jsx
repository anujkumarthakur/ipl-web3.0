// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgetPassword from './components/ForgetPassword';
import BuyTokenPage from './components/BuyTokenPage'; // Import BuyTokenPage
import MatchProfile from './components/MatchProfile';
import Profile from './components/Profile';

// Add icons to the library

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/buy-tokens" element={<BuyTokenPage />} /> {/* Route for buying tokens */}
        <Route path="/match/:matchId" element={<MatchProfile />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
}

export default App;
