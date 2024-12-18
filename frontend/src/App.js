import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { NFTDashboard } from './pages/NFTDashboard';
import { Navbar } from './components/Navbar';
import NFTMarketPlace from './pages/NFTMarketPlace';
import OnchainIdentityPage from './pages/OnchainIdentityPage';
import Details from './pages/Details';
import ProcessingScreen from './components/ProcessingScreen';
import Home from './pages/Home';
import OnchainIdentity from './pages/OnchainIdentity';


function App() {
  return (
    <Router>
      <div className="flex w-screen min-h-screen bg-[#1C1E2A]">
        {/* <Navbar /> */}
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
    </Router>
  );
}

export default App;