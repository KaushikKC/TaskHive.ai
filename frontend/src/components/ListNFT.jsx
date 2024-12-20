import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiNftFill } from "react-icons/ri";
import { SiSolana } from "react-icons/si";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import process from "process";

function ListNFT({ onClose }) {
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    description: "",
    price: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Upload image to IPFS
      const imageUrl = await uploadToIPFS(formData.image);

      // 2. Create and upload metadata to IPFS
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        symbol: "NFT", // Add symbol for minting
        attributes: [],
        properties: {
          files: [{ uri: imageUrl, type: "image/jpeg" }],
          category: "image",
          creators: [
            {
              address: publicKey.toString(),
              share: 100,
            },
          ],
        },
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const metadataUri = await uploadToIPFS(metadataBlob);

      // 3. Mint NFT
      const mintResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nft/mint`,
        {
          name: formData.name,
          symbol: "NFT",
          uri: metadataUri,
          payer: publicKey.toString(),
        }
      );

      if (!mintResponse.data.mint) {
        throw new Error("Failed to mint NFT");
      }

      // 4. List NFT for sale
      const listResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nft/list`,
        {
          price: parseFloat(formData.price),
          metadataUri,
          nftMint: mintResponse.data.mint,
          seller: publicKey.toString(),
        }
      );

      if (listResponse.data) {
        toast.success("NFT minted and listed successfully!");
        console.log("Mint signature:", mintResponse.data.signature);
        console.log("List signature:", listResponse.data.signature);
        console.log("Listing address:", listResponse.data.listingAddress);
        onClose();
      }
    } catch (error) {
      console.error("Error creating and listing NFT:", error);
      toast.error(
        error.response?.data?.error || "Failed to create and list NFT"
      );
    } finally {
      setIsLoading(false);
    }
  };
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
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">NFT Image</label>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-full h-48 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400">Click to upload image</p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter NFT name"
              className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter a brief description"
              className="w-full h-24 rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">
              Price (in SOL)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              step="0.01"
              min="0"
              className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Seller */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium">
              Seller Address
            </label>
            <input
              type="text"
              value={publicKey}
              placeholder="Enter your wallet address"
              className="w-full rounded-lg bg-gray-900 p-3 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex bg-white gap-2 text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white"
            >
              <RiNftFill className="w-6 h-6" />
              {isLoading ? "Creating..." : "List NFT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ListNFT;
