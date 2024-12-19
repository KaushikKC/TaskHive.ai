import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FloatingElements from "../components/FloatingElements";
import bg from "../images/bg.png";
import { Link } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Home = () => {
  const { publicKey, connected, connect, wallets, select, disconnect } =
    useWallet();
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnect = async () => {
    if (wallets.length > 0) {
      await select(wallets[0].adapter.name);
    }
  };

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [publicKey]);

  return (
    <div
      className="relative font-tektur w-full h-screen bg-transparent text-white overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark or Blur Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        {/* Main Heading with Typing Animation */}
        <motion.h1
          className="text-[30px] md:text-[35px] font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Autonomous Task Executor with{" "}
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
            animate={{
              opacity: [0, 1, 0.8, 1],
              x: [0, -20, 0, 20],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: ["easeIn", "easeOut"],
            }}
          >
            AI-Powered Onchain Identity and Shared Graph
          </motion.span>
        </motion.h1>
        {/* Subtext with Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-6 text-lg md:text-2xl text-gray-300"
        >
          Autonomous Execution Powered by AI and Onchain Trust{" "}
        </motion.p>
        {/* Buttons with Hover and Click Animations */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="mt-8 flex gap-6 font-anta flex-wrap justify-center"
        >
          <Link to="/onchain">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-white font-semibold rounded-full bg-transparent border-2 border-[#0997FF] relative overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#0997FF] opacity-50" />
              Get Started
            </motion.button>
          </Link>
          <motion.button
            onClick={connected ? disconnect : handleConnect}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-white font-semibold rounded-full bg-transparent border-2 border-[#0997FF] relative overflow-hidden transform transition-all duration-300 hover:border-[#0997FF] hover:text-white hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-l from-purple-500 to-blue-500 opacity-50" />
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              {connected ? walletAddress : "Connect Wallet"}
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
      ;{/* Floating Elements */}
      <FloatingElements />
    </div>
  );
};

export default Home;
