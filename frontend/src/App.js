

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { NFTDashboard } from './pages/NFTDashboard';
import { Navbar } from './components/Navbar';
import NFTMarketPlace from './pages/NFTMarketPlace';
import OnchainIdentityPage from './pages/OnchainIdentityPage';
import Details from './pages/Details';
import ProcessingScreen from './components/ProcessingScreen';
import Home from './pages/Home';
import OnchainIdentity from './pages/OnchainIdentity';

const App = () => {
  const location = useLocation(); // Get the current route

  // Define routes where the Navbar should be hidden
  const noNavbarRoutes = ['/', '/onchain'];

  return (
    <div className="flex w-screen min-h-screen bg-[#1C1E2A]">
      {/* Render Navbar only if the current route is not in the noNavbarRoutes list */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<NFTDashboard />} />
          <Route path="/nft" element={<NFTMarketPlace />} />
          <Route path="/onchain" element={<OnchainIdentity />} />
          <Route path="/identity" element={<OnchainIdentityPage />} />
          <Route path="/details" element={<Details />} />
          <Route path="/processing" element={<ProcessingScreen />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
