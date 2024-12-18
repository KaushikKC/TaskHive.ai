import React from "react";
import { SiSolana } from "react-icons/si";
import bg from "../images/bg.png";
import CursorGlow from "../components/CursorGlow";
import { Link } from "react-router-dom";

const OnchainIdentity = () => {
  return (
    <div className="relative font-anta w-full h-screen bg-transparent text-white overflow-hidden">
      {/* Background with Blur Effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(0.5px)" // Apply blur only to the background
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      {/* Floating 3D Models */}
      <CursorGlow />

      {/* Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 rounded-xl shadow-md my-8 bg-[#1C1E2A]">
        <h2 className="text-center font-tektur text-2xl font-bold mb-6 font-tektur">
          Onchain Identity
        </h2>

        {/* Nickname Input */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">Nickname</label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 gap-4">
            <input
              type="text"
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="How should we call you?"
            />
          </div>
        </div>

        {/* Reputation Score */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Reputation Score
          </label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 gap-4">
            <SiSolana className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Trust Level (in %)"
            />
          </div>
        </div>

        {/* Categories Preferred */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Categories Preferred
          </label>
          <div className="flex flex-col gap-2 bg-gray-800 rounded-lg px-4 py-3">
            <span className="text-gray-300 text-sm font-medium">
              Gaming NFTs
            </span>
            <span className="text-gray-300 text-sm font-medium">
              Music NFTs
            </span>
          </div>
        </div>

        {/* Sentience Level */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Sentience Level
          </label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3">
            <input
              type="number"
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Enter a value"
            />
          </div>
        </div>

        {/* Save Button */}
        <Link to="/dashboard" className="flex justify-center mt-6">
          <button className="bg-white text-[#0997FF] hover:bg-[#0997FF] px-6 py-2 rounded-lg hover:text-white transition-all duration-300">
            Save
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OnchainIdentity;
