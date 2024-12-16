import React from "react";
import nftimage1 from "../images/nftimage1.png";

const NFTCard = ({ flightName, price, rationale }) => {
  return (
    <div
      className="relative group w-70 mx-auto rounded-[30px] overflow-hidden bg-gradient-to-br from-[#1A1C2E] to-[#292B3F] shadow-lg hover:shadow-2xl transition-transform duration-500 transform hover:-translate-y-2 hover:border-4 hover:border-[#0997FF]"
      style={{ height: "350px" }}
    >
      {/* NFT Image Section */}
      <div className="relative">
        <img
          src={nftimage1}
          alt="NFT Thumbnail"
          className="w-full  object-cover"
        />

        {/* Glassy Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold truncate">
              {flightName || "Flight to Mars"}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Price: {price || "0.75 ETH"}
            </p>
          </div>

          <p className="text-sm text-gray-200 italic mt-4">
            {rationale ||
              "This NFT aligns with your gaming preference and fits your budget."}
          </p>

          <button className="mt-4 w-full py-2 rounded-full bg-[#0997FF] text-white font-bold shadow-md hover:from-[#0883D0] hover:to-[#64CDB8] transition-all duration-300">
            Select
          </button>
        </div>
      </div>

      {/* Glassy Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-black/20 backdrop-blur-lg text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
        <h3 className="text-base font-semibold truncate">
          {flightName || "Flight to Mars"}
        </h3>
        <p className="text-sm text-gray-300 mt-1">
          Price: {price || "0.75 ETH"}
        </p>
      </div>
    </div>
  );
};

export default NFTCard;
