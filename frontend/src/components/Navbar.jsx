import React, { useState } from "react";
import logo from "../images/logo.png";
import home from "../images/Home.svg";
import dashboard from "../images/Category.svg";
import activity from "../images/Activity.svg";
import settings from "../images/settings.png";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation(); // Get the current URL path
  const [activeTab, setActiveTab] = useState(location.pathname);

  // Function to dynamically set the active tab
  const handleTabClick = path => {
    setActiveTab(path);
  };

  return (
    <div className="w-20 bg-[#262C3A] flex flex-col items-center py-4 space-y-8 rounded-full m-4">
      {/* Logo */}
      <Link to="/" onClick={() => handleTabClick("/dashboard")}>
        <img src={logo} alt="logo" className="w-10 h-10 my-10" />
      </Link>

      {/* Home */}
      <Link
        to="/dashboard"
        onClick={() => handleTabClick("/home")}
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${activeTab ===
        "/home"
          ? "bg-[#0997FF]"
          : "bg-gray-700 hover:bg-[#0997FF]"}`}
      >
        <img src={home} alt="home" className="w-6 h-6" />
      </Link>

      {/* Dashboard */}
      <Link
        to="/nft"
        onClick={() => handleTabClick("/dashboard")}
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${activeTab ===
        "/dashboard"
          ? "bg-[#0997FF]"
          : "bg-gray-700 hover:bg-[#0997FF]"}`}
      >
        <img src={dashboard} alt="dashboard" className="w-6 h-6" />
      </Link>

      {/* Activity */}
      <Link
        to="/activity"
        onClick={() => handleTabClick("/activity")}
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${activeTab ===
        "/activity"
          ? "bg-[#0997FF]"
          : "bg-gray-700 hover:bg-[#0997FF]"}`}
      >
        <img src={activity} alt="activity" className="w-6 h-6" />
      </Link>

      {/* Settings */}
      <Link
        to="/settings"
        onClick={() => handleTabClick("/settings")}
        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${activeTab ===
        "/settings"
          ? "bg-[#0997FF]"
          : "bg-gray-700 hover:bg-[#0997FF]"}`}
      >
        <img src={settings} alt="settings" className="w-6 h-6" />
      </Link>
    </div>
  );
}
