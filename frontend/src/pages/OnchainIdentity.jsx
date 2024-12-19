import React, { useEffect, useState } from "react";
import { SiSolana } from "react-icons/si";
import bg from "../images/bg.png";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { api } from "../utils/api";

const OnchainIdentity = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const nftCategories = [
    "Art NFTs",
    "Gaming NFTs",
    "Music NFTs",
    "Sports NFTs",
    "Collectibles",
    "Virtual Real Estate",
    "Domain Names",
    "DeFi NFTs",
    "Utility NFTs",
    "Metaverse Items",
  ];

  const [formData, setFormData] = useState({
    nickname: "",
    reputationScore: "",
    categories: [],
    sentienceLevel: "",
    maxBudget: 2,
    minRarity: 0.7,
  });

  useEffect(() => {
    if (!connected) {
      toast.error("Please connect your wallet first!");
      navigate("/");
    }
  }, [connected, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isCategorySelected = (category) =>
    formData.categories.includes(category);

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: isCategorySelected(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    console.log(formData);
  };

  const handleSubmit = async () => {
    try {
      if (!connected || !publicKey) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const response = await api.createUser({
        walletAddress: publicKey.toString(),
        nickname: formData.nickname,
        preferences: {
          maxBudget: Number(formData.maxBudget),
          minRarity: Number(formData.minRarity),
          favoriteCategories: formData.categories,
          autoBuyEnabled: false,
          autoRelistEnabled: false,
          nickname: formData.nickname,
          reputationScore: formData.reputationScore,
          sentienceLevel: formData.sentienceLevel,
        },
      });

      if (response) {
        localStorage.setItem("userNickname", formData.nickname);
        toast.success("Profile created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile. Please try again.");
    }
  };
  return (
    <div className="relative font-anta w-full min-h-screen bg-transparent text-white overflow-auto">
      {/* Background with Blur Effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(0.5px)", // Apply blur only to the background
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      {/* Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 rounded-xl shadow-md my-8 bg-[#1C1E2A]">
        <h2 className="text-center text-2xl font-bold mb-6 font-tektur">
          Onchain Identity
        </h2>

        {/* Nickname Input */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">Nickname</label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 gap-4">
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
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
              name="reputationScore"
              value={formData.reputationScore}
              onChange={handleInputChange}
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Trust Level (in %)"
            />
          </div>
        </div>
        {/* Max Budget */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Max Budget (SOL)
          </label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 gap-4">
            <SiSolana className="w-5 h-5 text-blue-400" />
            <input
              type="number"
              name="maxBudget"
              value={formData.maxBudget}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Enter max budget in SOL"
            />
          </div>
        </div>

        {/* Min Rarity */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Min Rarity Score
          </label>
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-3 gap-4">
            <input
              type="number"
              name="minRarity"
              value={formData.minRarity}
              onChange={handleInputChange}
              min="0"
              max="1"
              step="0.1"
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Enter minimum rarity (0-1)"
            />
          </div>
        </div>

        {/* Categories Preferred */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Categories Preferred
          </label>
          <div className="flex flex-wrap gap-2 bg-gray-800 rounded-lg p-4">
            {nftCategories.map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 ${
                  isCategorySelected(category)
                    ? "bg-[#0997FF] text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {category}
              </div>
            ))}
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
              name="sentienceLevel"
              value={formData.sentienceLevel}
              onChange={handleInputChange}
              className="bg-transparent outline-none w-full text-gray-300 placeholder-gray-500"
              placeholder="Enter a value"
            />
          </div>
        </div>

        {/* Save Button */}
        <Link to="/dashboard" className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-white text-[#0997FF] hover:bg-[#0997FF] px-6 py-2 rounded-lg hover:text-white transition-all duration-300"
          >
            Save
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OnchainIdentity;
