import React, { useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { NFTDashboard } from "./pages/NFTDashboard";
import { Navbar } from "./components/Navbar";
import NFTMarketPlace from "./pages/NFTMarketPlace";
import OnchainIdentityPage from "./pages/OnchainIdentityPage";
import Details from "./pages/Details";
import ProcessingScreen from "./components/ProcessingScreen";
import Home from "./pages/Home";
import OnchainIdentity from "./pages/OnchainIdentity";
import CursorGlow from "./components/CursorGlow";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  // const endpoint = process.env.REACT_APP_SOLANA_RPC_URL;
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );
  const location = useLocation(); // Get the current route

  // Define routes where the Navbar should be hidden
  const noNavbarRoutes = ["/", "/onchain"];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex w-screen min-h-screen bg-[#1C1E2A]">
            {/* Render Navbar only if the current route is not in the noNavbarRoutes list */}
            {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

            <div className="flex-grow">
              <CursorGlow />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<NFTDashboard />} />
                <Route path="/nft" element={<NFTMarketPlace />} />
                <Route path="/onchain" element={<OnchainIdentity />} />
                <Route path="/identity" element={<OnchainIdentityPage />} />
                <Route path="/details" element={<Details />} />
                <Route path="/processing" element={<ProcessingScreen />} />
              </Routes>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
