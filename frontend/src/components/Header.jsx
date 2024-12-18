import React, { useState } from "react";
import message from "../images/Notification.svg";
import avatar from "../images/avatar.png";
import OnchainIdentity from "../pages/OnchainIdentity";
import { Link } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

function Header() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isNotificationPanel, setIsNotificationPanel] = useState(false);
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
          <div>
            <p className="text-sm">0x4ikBA....3jXl6</p>
            <div>
              <span className="text-gray-400">Your Balance: </span>
              <span className="text-[#0997FF] font-semibold text-sm">
                5,000 SOL
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conditionally render the popup */}
      {isPopupVisible && <OnchainIdentity onClose={togglePopup} />}
      {isNotificationPanel && <NotificationPanel onClose={handleClosePopup} />}
    </div>
  );
}

export default Header;
