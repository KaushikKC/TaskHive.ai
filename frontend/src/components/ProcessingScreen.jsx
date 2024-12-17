// import React, { useState, useEffect } from "react";

// const ProcessingScreen = ({ onComplete }) => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const steps = [
//     "Parsing input...",
//     "Fetching data...",
//     "Shortlisting recommendations...",
//     "Finalizing results..."
//   ];

//   useEffect(
//     () => {
//       const interval = setInterval(() => {
//         setCurrentStep(prev => {
//           if (prev < steps.length - 1) {
//             return prev + 1;
//           } else {
//             clearInterval(interval);
//             setTimeout(onComplete, 1000);
//             return prev;
//           }
//         });
//       }, 2000);
//       return () => clearInterval(interval);
//     },
//     [onComplete]
//   );

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#0E0F1E] text-white">
//       {/* Header */}
//       <h1 className="text-3xl font-bold mb-6 text-center animate-pulse">
//         Processing Your Request
//       </h1>

//       {/* Loader */}
//       <div className="relative flex items-center justify-center w-16 h-16 mb-6">
//         <div className="relative flex">
//           {[...Array(8)].map((_, i) =>
//             <div
//               key={i}
//               className="absolute w-2 h-2 bg-[#00D0FF] rounded-full"
//               style={{
//                 transform: `rotate(${i * 45}deg) translate(2.5rem)`,
//                 animation: `pulse 1.5s infinite ease-in-out ${i * 0.2}s`
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Steps Box */}
//       <div className="bg-[#1A1C2C] rounded-xl shadow-lg p-6 w-[90%] sm:w-[600px]">
//         <div className="text-gray-300 mb-4">
//           AI is working on your request...
//         </div>
//         <ul className="space-y-3">
//           {steps.map((step, index) =>
//             <li
//               key={index}
//               className={`flex items-center ${index <= currentStep
//                 ? "text-green-400"
//                 : "text-gray-400 opacity-50"}`}
//             >
//               <div
//                 className={`w-3 h-3 rounded-full mr-3 ${index < currentStep
//                   ? "bg-green-400"
//                   : index === currentStep
//                     ? "animate-ping bg-green-400"
//                     : "bg-gray-400"}`}
//               />
//               <p className="transition-opacity duration-500">
//                 {step}
//               </p>
//             </li>
//           )}
//         </ul>
//       </div>

      // {/* Insight Section */}
      // {currentStep === steps.length - 1 &&
      //   <div className="mt-8 p-4 w-[90%] sm:w-[600px] bg-[#131520] rounded-lg shadow-md text-center">
      //     <p className="text-yellow-400 font-semibold mb-2">
      //       ✨ Shared Graph Insight
      //     </p>
      //     <p className="text-gray-300 text-sm">
      //       Trending NFTs for Gaming:{" "}
      //       <span className="text-white">Token123</span>,{" "}
      //       <span className="text-white">Token456</span>
      //     </p>
      //   </div>}
//     </div>
//   );
// };

// export default ProcessingScreen;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProcessingScreen = ({ onComplete, redirectTo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Parsing input...",
    "Fetching data...",
    "Shortlisting recommendations...",
    "Finalizing results..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.(); // Trigger the parent function
            navigate(redirectTo); // Navigate to the redirection link
          }, 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete, navigate, redirectTo]);

  return (

  <div
  className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1C1E2A] bg-opacity-50 backdrop-blur-lg z-50"
>
  <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6 text-center animate-pulse font-tektur">
        Processing Your Request
      </h1>

      {/* Loader */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#00D0FF] rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translate(2.5rem)`,
              animation: `pulse 1.5s infinite ease-in-out ${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="bg-[#1A1C2C] rounded-xl shadow-lg p-6 w-[90%] sm:w-[600px]">
        <div className="text-gray-300 mb-4">AI is working on your request...</div>
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`flex items-center ${
                index <= currentStep ? "text-green-400" : "text-gray-400 opacity-50"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  index < currentStep
                    ? "bg-green-400"
                    : index === currentStep
                    ? "animate-ping bg-green-400"
                    : "bg-gray-400"
                }`}
              />
              <p className="transition-opacity duration-500">{step}</p>
            </li>
          ))}
        </ul>
      </div>
        {/* Insight Section */}
    {currentStep === steps.length - 1 &&
        <div className="mt-8 p-4 w-[90%] sm:w-[600px] bg-[#131520] rounded-lg shadow-md text-center">
          <p className="text-yellow-400 font-semibold mb-2">
            ✨ Shared Graph Insight
          </p>
          <p className="text-gray-300 text-sm">
            Trending NFTs for Gaming:{" "}
            <span className="text-white">Token123</span>,{" "}
            <span className="text-white">Token456</span>
          </p>
        </div>}
    </div>
  
    </div>
  );
};

export default ProcessingScreen;
