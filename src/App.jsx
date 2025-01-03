// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgetPassword from './components/ForgetPassword';
import BuyTokenPage from './components/BuyTokenPage';
import MatchProfile from './components/MatchProfile';
import Profile from './components/Profile';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import LiveMatch from './components/LiveMatch';
import DepositFunds from './components/DepositFund';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/deposit-fund" element={<PrivateRoute element={<DepositFunds />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

        {/* Match Profile route */}
        <Route path="/match/:matchId" element={<PrivateRoute element={<MatchProfile />} />} />
        <Route path="/admin/live-match" element={<LiveMatch />} />

      </Routes>
    </Router>
  );
}

export default App;
