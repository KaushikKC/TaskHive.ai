import React from "react";
import { RiNftFill } from "react-icons/ri";
import { SiSolana } from "react-icons/si";

function ListNFT({ onClose }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      {/* Popup Content */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg p-6 w-[500px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-300 hover:text-white transition-colors duration-200 text-[20px]"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-center text-xl font-bold mb-6 font-tektur">
          List Your NFT
        </h2>

        {/* Metadata URI */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Metadata URI</label>
          <input
            type="text"
            placeholder="Enter the metadata URI"
            className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Name</label>
          <input
            type="text"
            placeholder="Enter NFT name"
            className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Description</label>
          <textarea
            placeholder="Enter a brief description"
            className="w-full h-24 rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Price (in SOL)
          </label>
          <input
            type="number"
            placeholder="Enter price"
            className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Seller */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">
            Seller Address
          </label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button className="flex bg-white gap-2 text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white">
            <RiNftFill className="w-6 h-6" />
            List NFT
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListNFT;
