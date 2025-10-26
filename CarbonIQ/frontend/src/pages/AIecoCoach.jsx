import React from "react";
import Sidebar from "../components/Sidebar";

// Icon imports (Using the paths provided in your code)
const AiEcoCoachIcon = new URL("../assets/icons/aiEcoCoachIcon.svg", import.meta.url).href;
const LightBulbIcon = new URL("../assets/icons/lightBulb.svg", import.meta.url).href;
const ExportTrendingDownIcon = new URL("../assets/icons/exportTrendingDown.svg", import.meta.url).href;
const ProgressionIcon = new URL("../assets/icons/progressionIcon.svg", import.meta.url).href;

const CoachingCard = ({ bgColor, textColor, subColor, icon, title, text }) => (
  <div
    // Added overflow-hidden to ensure content stays within bounds
    className="p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl 
               flex flex-col items-center justify-center h-[180px] cursor-pointer w-full overflow-hidden" 
    style={{ backgroundColor: bgColor }}
  >
    <img
      src={icon}
      alt={`${title} Icon`} 
      className="w-8 h-8 mb-3 transition-transform duration-200 hover:scale-110"
    />
    <h2 className="text-xl font-semibold mb-1" style={{ color: textColor }}>
      {title}
    </h2>
    <p className="text-sm text-center px-2" style={{ color: subColor }}>
      {text}
    </p>
  </div>
);

function AIecoCoach() {
  return (
    // Uses GRID to define two columns: 16rem for sidebar, 1fr for content.
    <div className="grid grid-cols-[16rem_1fr] min-h-screen bg-white font-sans">
      
      {/* Sidebar is in the first column */}
      <Sidebar />

      {/* Main Content Area is in the second column. */}
      <main className="pt-8 overflow-y-auto bg-[#FFFFFF] px-10">
        
        {/* Header Section: Centered and Proportional (max-w-md is fine here) */}
        <div className="flex flex-col items-center mb-12 max-w-md mx-auto"> 
          
          <div className="flex items-center gap-6">
              {/* AI Eco-Coach Icon Container (Purple/Pink) */}
              <div className="w-16 h-16 rounded-2xl bg-[#E5B5FF] flex items-center justify-center flex-shrink-0">
                <img
                  src={AiEcoCoachIcon}
                  alt="AI Eco-Coach Icon"
                  className="w-10 h-10 transition-transform duration-200 hover:scale-110"
                />
              </div>
              
              {/* Header Text */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">AI Eco-Coach</h1>
                <p className="text-base text-gray-600">
                  Get personalized insights and behavioral nudges
                </p>
              </div>
          </div>
        </div>

        {/* Horizontal Card Layout: Reduced width to max-w-4xl and centered. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <CoachingCard
            bgColor="#FEF9C3" 
            textColor="#867C00"
            subColor="#A79D21"
            icon={LightBulbIcon}
            title="General Tips"
            text="Get actionable eco-friendly suggestions."
          />

          <CoachingCard
            bgColor="#DBEAFE" 
            textColor="#4B5A82"
            subColor="#8695BD"
            icon={ExportTrendingDownIcon}
            title="Reduction Plan"
            text="Strategies to cut emissions by 20%."
          />

          <CoachingCard
            bgColor="#D1FAE5" 
            textColor="#3E7C64"
            subColor="#648989"
            icon={ProgressionIcon}
            title="Progress Check"
            text="Assess your avoidable impact."
          />
        </div>
      </main>
    </div>
  );
}

export default AIecoCoach;