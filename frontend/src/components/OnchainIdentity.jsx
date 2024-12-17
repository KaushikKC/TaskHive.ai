// import React from "react";
// import { RiRobot2Line } from "react-icons/ri";
// import { SiSolana } from "react-icons/si";

// function OnchainIdentity({ onClose }) {
//   return (
//     <div
//       className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300`}
//     >
//       {/* Popup Content */}
//       <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg p-6 w-[500px] relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose} // Call the passed onClose function
//           className="absolute top-2 right-4 text-gray-300 hover:text-white transition-colors duration-200 text-[20px]"
//         >
//           &times;
//         </button>

//         {/* Header */}
//         <h2 className="text-center text-xl font-bold mb-6 font-tektur">
//           Create your Task here...
//         </h2>

//         {/* Task Input */}
//         <div>
//           <label className="block mb-2 text-lg font-medium">
//             Prompt for your Task
//           </label>
//           <div className="relative">
//             <textarea
//               placeholder="Describe your task briefly.."
//               className="w-full h-24 rounded-lg bg-gray-900 p-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
//             />
//           </div>
//         </div>

//         {/* Wallet Balance */}
//         <div className="mt-4">
//           <label className="block mb-2 text-lg font-medium">
//             Wallet Balance
//           </label>
//           <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3 gap-4">
//             <SiSolana className="w-4 h-4" />
//             <span className="text-gray-300 text-sm font-medium">4.500 SOL</span>
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="flex justify-center mt-6">
//           <button className="flex bg-white gap-2 text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white">
//             <RiRobot2Line className="w-6 h-6" />
//             Ask AI
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OnchainIdentity;

import React from "react";
import { RiRobot2Line } from "react-icons/ri";
import { SiSolana } from "react-icons/si";

function OnchainIdentity({ onClose }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      {/* Popup Content */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg p-6 w-[500px] relative">
        {/* Close Button */}
        <button
          onClick={onClose} // Call the passed onClose function
          className="absolute top-2 right-4 text-gray-300 hover:text-white transition-colors duration-200 text-[20px]"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-center text-xl font-bold mb-6 font-tektur">
          Onchain Identity
        </h2>

        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">Nickname</label>
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3 gap-4">
            <input
              type="text"
              className="bg-transparent outline-none"
              placeholder="How should we call you?"
            />
          </div>
        </div>
        {/* Reputation Score */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Reputation Score
          </label>
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3 gap-4">
            <SiSolana className="w-4 h-4" />
            {/* <span className="text-gray-300 text-sm font-medium">
              80% Trust Level
            </span> */}
            <input
              type="text"
              className="bg-transparent outline-none"
              placeholder="Trust Level (in %)"
            />
          </div>
        </div>

        {/* Categories Preferred */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Categories Preferred
          </label>
          <div className="flex flex-col gap-2 bg-gray-900 rounded-lg px-4 py-3">
            <span className="text-gray-300 text-sm font-medium">
              Gaming NFTs
            </span>
            <span className="text-gray-300 text-sm font-medium">
              Music NFTs
            </span>
          </div>
        </div>

        {/* Previous Purchases */}
        <div className="mt-4">
          <label className="block mb-2 text-lg font-medium">
            Sentience Level
          </label>
          <div className="flex flex-col bg-gray-900 rounded-lg px-4 py-3">
            <input
              type="number"
              className="bg-transparent outline-none"
              placeholder=""
            />
          </div>
        </div>

        {/* Ask AI Button */}
        <div className="flex justify-center mt-6">
          <button className=" bg-white text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnchainIdentity;