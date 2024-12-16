import React, { useState } from "react";

function AIPromptPopup() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300 ${showPopup
        ? "opacity-100"
        : "opacity-0 pointer-events-none"}`}
    >
      {/* Popup Content */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg p-6 w-[500px] relative">
        {/* Close Button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors duration-200"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-center text-xl font-bold mb-6">
          Create your Task here...
        </h2>

        {/* Task Input */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Prompt for your Task
          </label>
          <div className="relative">
            <textarea
              placeholder="Describe your task briefly.."
              className="w-full h-24 rounded-lg bg-gray-900 p-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute top-3 left-4 text-gray-400">✍️</span>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">
            Wallet Balance
          </label>
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3">
            <span className="text-lg mr-2">💰</span>
            <span className="text-gray-300 text-sm font-medium">4.500 SOL</span>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg font-medium transition-all duration-300">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIPromptPopup;
