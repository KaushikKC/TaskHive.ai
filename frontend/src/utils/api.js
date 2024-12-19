const API_BASE_URL = "http://localhost:4000/api";

export const api = {
  // User APIs
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getUserProfile: async (walletAddress) => {
    const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`);
    return response.json();
  },

  // NFT APIs
  fetchListings: async () => {
    const response = await fetch(`${API_BASE_URL}/nft/listings`);
    return response.json();
  },

  // Agent APIs
  getRecommendations: async (walletAddress) => {
    const response = await fetch(
      `${API_BASE_URL}/agent/recommendation/${walletAddress}`
    );
    return response.json();
  },

  buyNFT: async (walletAddress, nftId) => {
    const response = await fetch(`${API_BASE_URL}/agent/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, nftId }),
    });
    return response.json();
  },
};
