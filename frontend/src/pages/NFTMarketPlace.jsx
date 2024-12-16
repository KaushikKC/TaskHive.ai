import React from "react";
import Header from "../components/Header";
import { CiSearch } from "react-icons/ci";
import popular from "../images/popular.png";
import art from "../images/art.png";
import game from "../images/game.png";
import photo from "../images/photo.png";
import music from "../images/music.png";
import sport from "../images/sport.png";
import NFTCard from "../components/NFTCard";
function NFTMarketPlace() {
  return (
    <div className="bg-[#1C1E2A] text-white min-h-screen p-4 font-anta">
      {/* Header */}
      <Header />
      <div className="flex flex-col md:flex-row items-center bg-[#262C3A] rounded-lg p-4 my-8 w-[800px]">
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
      <div>
        <p className="text-[20px] font-bold mb-4">NFT Marketplace</p>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <NFTCard title="The Future wave #23" creator="@spaceman" />
          <NFTCard title="Astro World #244" creator="@astrowave" />
          <NFTCard title="Cyber Art #234" creator="@cybermask" />
          <NFTCard title="The Future wave #23" creator="@spaceman" />
          <NFTCard title="Astro World #244" creator="@astrowave" />
          <NFTCard title="Cyber Art #234" creator="@cybermask" />
        </div>
      </div>
    </div>
  );
}

export default NFTMarketPlace;
