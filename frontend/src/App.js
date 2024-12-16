import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { NFTDashboard } from './pages/NFTDashboard';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="flex w-screen min-h-screen bg-[#1C1E2A]">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<NFTDashboard />} />
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;