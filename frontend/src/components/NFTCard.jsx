import React from "react";
import nftimage1 from "../images/nftimage1.png";

const NFTCard = ({ flightName, price, rationale }) => {
  return (
    <div className="relative group w-80 mx-auto rounded-[30px] overflow-hidden bg-gradient-to-br from-[#1A1C2E] to-[#292B3F] shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:-translate-y-2 hover:border-4 hover:border-[#0997FF]">
      {/* NFT Image Section */}
      <div className="relative">
        <img
          src={nftimage1}
          alt="NFT Thumbnail"
          className="w-full h-52 object-cover rounded-t-[30px]"
        />
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
          <button className="px-6 py-3 bg-[#0997FF] text-white font-bold text-sm rounded-full shadow-md hover:bg-[#0883D0] transition-all duration-300">
            View Details
          </button>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-6 text-white font-['Poppins'] relative">
        {/* Flight Name and Price */}
        <div className="mb-4">
          <h3 className="text-lg font-extrabold truncate">
            {flightName || "Flight to Mars"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Price: {price || "0.75 ETH"}
          </p>
        </div>

        {/* AI-based Rationale */}
        <p className="text-sm text-gray-300 italic mb-6">
          {rationale ||
            "This NFT aligns with your gaming preference and fits your budget."}
        </p>

        {/* Select/Buy Button */}
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[90%]">
          <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#0997FF] to-[#7DE2D1] text-white font-bold shadow-lg hover:from-[#0883D0] hover:to-[#64CDB8] transition-all duration-300">
            Select/Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
