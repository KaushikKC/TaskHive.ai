import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Import the back arrow icon
import { useNavigate } from "react-router-dom"; // React Router for navigation
import Header from "../components/Header";
import nftimage1 from "../images/nftimage1.png";

function Details() {
  const navigate = useNavigate(); // Hook for navigation

  const nft = {
    name: "Mystic Dragon",
    image: nftimage1,
    description:
      "A rare and mystical dragon NFT from the enchanted realms collection. Own a piece of digital history.",
    price: "2.5 SOL",
    seller: "@DragonMaster"
  };

  return (
    <div className="bg-[#1C1E2A] text-white min-h-screen p-4 font-anta">
      {/* Header */}
      <Header />

      {/* Back Button */}
      <div className="flex items-center my-6">
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="flex items-center gap-2 text-[#0997FF] hover:text-blue-400 font-semibold"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* NFT Details Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1A1C2C] to-[#2A2D3E] p-6 rounded-xl shadow-md mt-8">
        <h2 className="text-[28px] font-bold text-center mb-6 font-tektur">
          {nft.name}
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* NFT Image */}
          <div className="flex-shrink-0">
            <img
              src={nft.image}
              alt={nft.name}
              className="rounded-lg shadow-[18px] w-full md:w-80"
            />
          </div>

          {/* NFT Info */}
          <div className="flex flex-col justify-between flex-1">
            <p className="text-gray-300 text-[16px] mb-4">
              {nft.description}
            </p>

            <div className="mt-4">
              <p className="text-[18px] font-semibold mb-2">
                Price: <span className="text-[#00D0FF]">{nft.price}</span>
              </p>
              <p className="text-[16px] text-gray-400 mb-2">
                Seller: <span className="text-[#00D0FF]">{nft.seller}</span>
              </p>
            </div>

            {/* Buy Button */}
            <button className="bg-white text-[#0997FF] hover:bg-[#0997FF] p-4 rounded-lg hover:text-white">
              Buy Now
            </button>
            <p className="mt-4">
              ✨ This NFT has 80% popularity in the gaming category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
