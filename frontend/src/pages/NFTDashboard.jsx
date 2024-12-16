// Import necessary libraries
import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NFTCard from "../components/NFTCard";
import QuickActionCard from "../components/QuickActionCard";
import { CiSearch } from "react-icons/ci";
import popular from "../images/popular.png";
import art from "../images/art.png";
import game from "../images/game.png";
import photo from "../images/photo.png";
import music from "../images/music.png";
import sport from "../images/sport.png";
import Chart from "../components/Chart";
import cardbg1 from "../images/card-quick-bg.png";
import cardbg2 from "../images/card-quick-bg1.png";
import cardbg3 from "../images/card-quick-bg3.png";
import AIPromptPopup from "../components/AIPromptPopup";
import Header from "../components/Header";
import ProcessingScreen from "../components/ProcessingScreen";
export const NFTDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTaskCreation = () => {
    setIsProcessing(true);
    // Simulate task processing
    setTimeout(() => {
      setIsProcessing(false); // Show the main screen after processing
    }, 10000); // Total processing time (10 seconds)
  };

  if (isProcessing) {
    return <ProcessingScreen onComplete={() => setIsProcessing(false)} />;
  }

  // Handler to show the popup
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="bg-[#1C1E2A] text-white min-h-screen p-4 font-anta">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left Section */}
        <section className="lg:col-span-7">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-[#262C3A] rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4 flex-grow mb-4 md:mb-0">
              <CiSearch className="w-6 h-6" />
              <input
                type="text"
                placeholder="Search items, collection, accounts"
                className="flex-grow bg-transparent outline-none text-white placeholder-[#A3B2C8]"
              />
            </div>
            <button className="bg-white text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white">
              Search
            </button>
          </div>

          {/* My NFTs */}
          <div>
            <div className="flex justify-between items-center">
              <p className="text-[20px] font-bold mb-4">My NFTs</p>
              <p className="text-[16px] text-[#0997FF] cursor-pointer">
                See all
              </p>
            </div>
            <div className="mb-6 gap-4 flex flex-wrap justify-center sm:justify-start">
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={popular} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Popular</p>
              </div>
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={art} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Arts</p>
              </div>
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={game} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Games</p>
              </div>
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={music} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Music</p>
              </div>
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={sport} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Sports</p>
              </div>
              <div className="bg-[#262C3A] flex items-center space-x-3 p-3 rounded-lg cursor-pointer w-full sm:w-auto">
                <img src={photo} alt="" className="w-9 h-9" />
                <p className="text-[#A3B2C8]">Photography</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NFTCard title="The Future wave #23" creator="@spaceman" />
              <NFTCard title="Astro World #244" creator="@astrowave" />
              <NFTCard title="Cyber Art #234" creator="@cybermask" />
            </div>
          </div>

          {/* Recommended */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <p className="text-[20px] font-bold mb-4">Recommended</p>
              <p className="text-[16px] text-[#0997FF] cursor-pointer">
                See all
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <NFTCard title="The Future wave #23" creator="@spaceman" />
              <NFTCard title="Astro World #244" creator="@astrowave" />
              <NFTCard title="Cyber Art #234" creator="@cybermask" />
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="lg:col-span-5">
          {/* Chart Summary */}
          <div className="bg-[#262C3A] rounded-lg p-4 mb-6">
            <h2 className="text-[20px] font-bold mb-4">Chart Summary</h2>
            <Chart />
          </div>

          {/* Quick Actions */}
          <div className="bg-[#262C3A] rounded-lg p-4 mb-6">
            <h2 className="text-[20px] font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <QuickActionCard
                title="Create New Task"
                emoji="✍️"
                bgColor="bg-[#694797]"
                bgImage={cardbg1}
                onGoClick={handleShowPopup}
                onClick={handleTaskCreation}
              />
              <QuickActionCard
                title="NFT Marketplace"
                emoji="💰"
                bgColor="bg-[#0997FF]"
                bgImage={cardbg2}
                onGoClick={handleTaskCreation}
              />
              <QuickActionCard
                title="Explore Insights"
                emoji="🌐"
                bgColor="bg-[#525151]"
                bgImage={cardbg3}
                onGoClick={handleShowPopup}
              />
            </div>
          </div>

          {/* Trending Insights */}
          <div className="bg-[#262C3A] rounded-lg p-4">
            <h2 className="text-[20px] font-bold mb-4">Trending Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NFTCard title="The Future wave #23" creator="@spaceman" />
              <NFTCard title="Cyber Art #234" creator="@cybermask" />
            </div>
          </div>
        </section>
      </main>

      {/* Popup */}
      {showPopup && <AIPromptPopup onClose={handleClosePopup} />}
    </div>
  );
};
