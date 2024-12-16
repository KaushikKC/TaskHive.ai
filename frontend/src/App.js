import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { NFTDashboard } from './pages/NFTDashboard';
import { Navbar } from './components/Navbar';
import NFTMarketPlace from './pages/NFTMarketPlace';
import OnchainIdentityPage from './pages/OnchainIdentityPage';
import Details from './pages/Details';


function App() {
  return (
    <Router>
      <div className="flex w-screen min-h-screen bg-[#1C1E2A]">
        <Navbar />
        <div className="flex-grow">

          <Routes>
            <Route path="/" element={<NFTDashboard />} />
            <Route path="/nft" element={<NFTMarketPlace />} />
            <Route path="/identity" element={<OnchainIdentityPage />} />
            <Route path="/details" element={<Details />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;