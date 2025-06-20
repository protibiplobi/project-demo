import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';

const App = () => (
  <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/seller" element={<SellerDashboard />} />
    <Route path="/buyer" element={<BuyerDashboard />} />
  </Routes>
);

export default App;
