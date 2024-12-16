// import React, { useState } from "react";
// import Header from "../components/Header";

// // Example AI Onchain Identity Component
// const OnchainIdentityPage = () => {
//   const [isGraphVisible, setGraphVisible] = useState(false);

//   const reputationScore = 85;
//   const sentienceLevel = 2;
//   const preferences = ["Gaming NFTs", "Flight Budget: <$500"];
//   const recentTransactions = [
//     { token: "Token123", type: "NFT", link: "#" },
//     { token: "Token456", type: "NFT", link: "#" }
//   ];

//   const toggleGraph = () => setGraphVisible(!isGraphVisible);

//   return (
//     <div className="bg-[#1C1E2A] text-white min-h-screen p-4 font-anta">
//       {/* Header */}
//       <Header />
//       <div className=" text-white p-6 rounded-xl shadow-md my-8">
//         {/* Onchain Identity Section */}
//         <div className="flex flex-col gap-4">
//           <h2 className="text-[22px] font-semibold">AI Onchain Identity</h2>

//           {/* Reputation and Sentience */}
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-[16px]">
//                 Reputation: {reputationScore}% Trust Level
//               </p>
//               <div className="flex items-center gap-2">
//                 <div className="text-[16px]">
//                   Sentience Level: {sentienceLevel}
//                 </div>
//                 <span className="text-yellow-400">🔐</span>
//               </div>
//             </div>
//             <div className="w-20">
//               <div className="h-2 bg-gray-600 rounded-full">
//                 <div
//                   className="h-2 bg-[#00D0FF] rounded-full"
//                   style={{ width: `${reputationScore}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Preferences */}
//           <div>
//             <h3 className="text-[16px] text-gray-400">Preferences</h3>
//             <ul className="text-[16px]">
//               {preferences.map((pref, index) =>
//                 <li key={index} className="text-[#A3B2C8]">
//                   - {pref}
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Recent Transactions */}
//           <div>
//             <h3 className="text-[16px] text-gray-400">Recent Transactions</h3>
//             <ul className="space-y-2 text-[16px]">
//               {recentTransactions.map((transaction, index) =>
//                 <li key={index} className="flex items-center gap-2">
//                   <a
//                     href={transaction.link}
//                     className="text-[#00D0FF] underline hover:text-blue-400"
//                   >
//                     {transaction.token}
//                   </a>
//                   <span className="text-gray-400">
//                     {transaction.type}
//                   </span>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Shared Graph Insights */}
//           <div className="mt-4">
//             <button
//               onClick={toggleGraph}
//               className="text-[#00D0FF] font-semibold hover:text-blue-400"
//             >
//               {isGraphVisible ? "Hide Graph Insights" : "Show Graph Insights"}
//             </button>

//             {isGraphVisible &&
//               <div className="mt-4 p-4 bg-[#1A1C2C] rounded-lg">
//                 <h4 className="text-[16px] text-gray-400">Shared Graph Insights</h4>
//                 <p className="text-[16px] text-[#A3B2C8]">
//                   Trending NFTs: Token123, Token456
//                 </p>
//                 <p className="text-[16px] text-[#A3B2C8]">
//                   Community Confidence: 70% recommend this NFT for gaming.
//                 </p>
//                 <p className="text-[16px] text-[#A3B2C8]">
//                   AI Insights: Shortlisted items based on 80% graph overlap.
//                 </p>
//               </div>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnchainIdentityPage;

import React, { useState } from "react";
import Header from "../components/Header";

// Enhanced AI Onchain Identity Page
const OnchainIdentityPage = () => {
  const [isGraphVisible, setGraphVisible] = useState(false);

  const reputationScore = 85;
  const sentienceLevel = 2;
  const preferences = ["Gaming NFTs", "Flight Budget: <$500"];
  const recentTransactions = [
    { token: "Token123", type: "NFT", link: "#" },
    { token: "Token456", type: "NFT", link: "#" }
  ];

  const toggleGraph = () => setGraphVisible(!isGraphVisible);

  return (
    <div className="bg-[#1C1E2A] text-white min-h-screen p-4 font-anta">
      {/* Header */}
      <Header />
      <div className="max-w-4xl mx-auto text-white p-6 rounded-xl shadow-md my-8 bg-gradient-to-br from-[#1A1C2C] to-[#2A2D3E]">
        {/* Onchain Identity Section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-[24px] font-bold text-center">
            AI Onchain Identity
          </h2>

          {/* Reputation and Sentience */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-medium">
                Reputation:{" "}
                <span className="text-[#0997FF]">
                  {reputationScore}% Trust Level
                </span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[16px]">
                  Sentience Level: {sentienceLevel}
                </span>
                <span className="text-yellow-400">🔐</span>
              </div>
            </div>
            <div className="w-full md:w-40">
              <div className="h-3 bg-gray-600 rounded-full">
                <div
                  className="h-3 bg-[#0997FF] rounded-full"
                  style={{ width: `${reputationScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-[#2A2D3E] p-4 rounded-lg">
            <h3 className="text-base font-semibold mb-2 text-gray-300">
              Preferences
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {preferences.map((pref, index) =>
                <li key={index} className="text-[#A3B2C8] text-[16px]">
                  {pref}
                </li>
              )}
            </ul>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#2A2D3E] p-4 rounded-lg">
            <h3 className=" font-semibold mb-2 text-gray-300">
              Recent Transactions
            </h3>
            <ul className="space-y-2">
              {recentTransactions.map((transaction, index) =>
                <li
                  key={index}
                  className="flex items-center justify-between text-[16px]"
                >
                  <a
                    href={transaction.link}
                    className="text-[#0997FF] underline hover:text-blue-400"
                  >
                    {transaction.token}
                  </a>
                  <span className="text-gray-400">
                    {transaction.type}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Shared Graph Insights */}
          <div className="mt-4 text-center">
            <button
              onClick={toggleGraph}
              className="bg-white text-[#0997FF] hover:bg-[#0997FF] px-4 py-2 rounded-lg hover:text-white"
            >
              {isGraphVisible ? "Hide Graph Insights" : "Show Graph Insights"}
            </button>

            {isGraphVisible &&
              <div className="mt-6 bg-[#1A1C2C] p-6 rounded-lg">
                <h4 className="text-base font-semibold mb-2 text-gray-300">
                  Shared Graph Insights
                </h4>
                <p className="text-[16px] text-[#A3B2C8]">
                  Trending NFTs:{" "}
                  <span className="text-[#00D0FF]">Token123</span>,{" "}
                  <span className="text-[#00D0FF]">Token456</span>
                </p>
                <p className="text-[16px] text-[#A3B2C8] mt-2">
                  Community Confidence:{" "}
                  <span className="text-green-400">70%</span> recommend this NFT
                  for gaming.
                </p>
                <p className="text-[16px] text-[#A3B2C8] mt-2">
                  AI Insights: Shortlisted items based on{" "}
                  <span className="text-yellow-400">80%</span> graph overlap.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnchainIdentityPage;
