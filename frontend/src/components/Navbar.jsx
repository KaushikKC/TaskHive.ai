import React from "react";
import logo from "../images/logo.png";
import home from "../images/Home.svg";
import dashboard from "../images/Category.svg";
import activity from "../images/Activity.svg";
import settings from "../images/settings.png";
export function Navbar() {
  return (
    <div className="w-20 bg-[#262C3A] flex flex-col items-center py-4 space-y-8 rounded-full m-4">
      <img src={logo} alt="home" className="w-10 h-10 my-10 " />

      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0997FF]">
        <img src={home} alt="" className="w-6 h-6 " />
      </div>
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0997FF]">
        <img src={dashboard} alt="" className="w-6 h-6 " />
      </div>
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0997FF]">
        <img src={activity} alt="" className="w-6 h-6" />
      </div>
      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0997FF]">
        <img src={settings} alt="home" className="w-6 h-6 " />
      </div>
    </div>
  );
}
