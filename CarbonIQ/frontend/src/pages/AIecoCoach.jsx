import React from "react";
import Sidebar from "../components/Sidebar";

// Icon imports
const AiEcoCoachIcon = new URL("../assets/icons/aiEcoCoachIcon.svg", import.meta.url).href;
const LightBulbIcon = new URL("../assets/icons/lightBulb.svg", import.meta.url).href;
const ExportTrendingDownIcon = new URL("../assets/icons/exportTrendingDown.svg", import.meta.url).href;
const ProgressionIcon = new URL("../assets/icons/progressionIcon.svg", import.meta.url).href;

const CoachingCard = ({ bgColor, textColor, subColor, icon, title, text }) => (
  <div
    className="w-[288px] h-[144px] p-6 rounded-[8px] shadow-2xl transition-shadow duration-300 hover:shadow-xl 
               flex flex-col items-center justify-center cursor-pointer overflow-hidden"
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
    <div className="grid grid-cols-[16rem_1fr] min-h-screen bg-white font-sans">
      <Sidebar />

      <main className="pt-8 overflow-y-auto bg-[#F9FAFB] px-10">

        {/* Heading block */}
        <div className="flex items-center gap-6 max-w-[1000px] mx-auto mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#E5B5FF] flex items-center justify-center flex-shrink-0">
            <img
              src={AiEcoCoachIcon}
              alt="AI Eco-Coach Icon"
              className="w-10 h-10 transition-transform duration-200 hover:scale-110"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Eco-Coach</h1>
            <p className="text-base text-gray-600">
              Get personalized insights and behavioral nudges
            </p>
          </div>
        </div>

        {/* Coaching Cards aligned with heading */}
        <div className="flex flex-wrap justify-between gap-y-8 px-4 max-w-[1000px] mx-auto mt-[24px]">
          {/* Card 1: Extra right padding */}
          <div className="pr-4">
            <CoachingCard
              bgColor="#FEF9C3" 
              textColor="#867C00"
              subColor="#A79D21"
              icon={LightBulbIcon}
              title="General Tips"
              text="Get actionable eco-friendly suggestions."
            />
          </div>

          {/* Card 2: Extra right padding */}
          <div className="pr-4">
            <CoachingCard
              bgColor="#DBEAFE" 
              textColor="#4B5A82"
              subColor="#8695BD"
              icon={ExportTrendingDownIcon}
              title="Reduction Plan"
              text="Strategies to cut emissions by 20%."
            />
          </div>

          {/* Card 3: Extra left padding */}
          <div className="pl-4">
            <CoachingCard
              bgColor="#D1FAE5" 
              textColor="#3E7C64"
              subColor="#648989"
              icon={ProgressionIcon}
              title="Progress Check"
              text="Assess your avoidable impact."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIecoCoach;
