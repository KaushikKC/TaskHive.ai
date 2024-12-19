import React, { useEffect, useState } from "react";
import message from "../images/Notification.svg";
import avatar from "../images/avatar.png";
import OnchainIdentity from "../pages/OnchainIdentity";
import { Link } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isNotificationPanel, setIsNotificationPanel] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const { publicKey, connected, connect, wallets, select, disconnect } =
    useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (publicKey) {
      // Set wallet address
      const address = publicKey.toString();
      setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);

      // Fetch balance
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance((balance / LAMPORTS_PER_SOL).toFixed(2));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      fetchBalance();
    }
  }, [publicKey, connection]);

  const handleConnect = async () => {
    if (wallets.length > 0) {
      await select(wallets[0].adapter.name);
    }
  };

  useEffect(() => {
    console.log(connected, publicKey);
  }, [connected, publicKey]);
  // Close the popup
  const handleClosePopup = () => {
    setIsNotificationPanel(false);
  };

  // Show the popup
  const handleShowPopup = () => {
    setIsNotificationPanel(true);
  };
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-center pt-4 px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] md:text-[32px] font-bold font-tektur mb-4 md:mb-0">
            Hi, Madhu!
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div
            onClick={handleShowPopup}
            className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0997FF]"
          >
            <img src={message} alt="" className="w-6 h-6" />
          </div>

          <Link to="/identity">
            <img src={avatar} alt="Profile" className="w-11 h-11" />
          </Link>
          {connected && (
            <div onClick={disconnect} className="cursor-pointer">
              <p className="text-sm">{walletAddress}</p>
              <div>
                <span className="text-gray-400">Your Balance: </span>
                <span className="text-[#0997FF] font-semibold text-sm">
                  {balance} SOL
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Conditionally render the popup */}
      {isPopupVisible && <OnchainIdentity onClose={togglePopup} />}
      {isNotificationPanel && <NotificationPanel onClose={handleClosePopup} />}
    </div>
  );
}

export default Header;
