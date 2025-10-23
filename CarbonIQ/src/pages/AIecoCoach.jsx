import React from 'react';

// Icon & Logo Imports
const CarbonLogo = new URL("../assets/logos/CarbonIQLogo.svg", import.meta.url).href;
const LightBulbIcon = new URL("../assets/icons/lightBulb.svg", import.meta.url).href;
const ExportTrendingDownIcon = new URL("../assets/icons/exportTrendingDown.svg", import.meta.url).href;
const ProgressionIcon = new URL("../assets/icons/progressionIcon.svg", import.meta.url).href;
const AiEcoCoachIcon = new URL("../assets/icons/aiEcoCoachIcon.svg", import.meta.url).href;
const DashboardIcon = new URL("../assets/icons/dashboardIcon.svg", import.meta.url).href;
const GoalsIcon = new URL("../assets/icons/goalsIcon.svg", import.meta.url).href;
const ActivitiesIcon = new URL("../assets/icons/activitiesIcon.svg", import.meta.url).href;
const MyAssetsIcon = new URL("../assets/icons/myAssetsIcon.svg", import.meta.url).href;
const AiEcoCoachAltIcon = new URL("../assets/icons/aiEcoCoachAltIcon.svg", import.meta.url).href;

export default function AIEcoCoach() {
  return (
    <div className="flex min-h-screen bg-[#FFFFFF] font-jost">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black flex flex-col justify-between border-r border-gray-200">
        <div className="p-6">
          <img src={CarbonLogo} alt="CarbonIQ Logo" className="w-40 h-auto mb-6 mx-auto" />

          {/* Navigation with Icons */}
          <nav className="space-y-4 text-sm font-medium">
            <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
              <img src={DashboardIcon} alt="Dashboard Icon" className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
              <img src={MyAssetsIcon} alt="My Assets Icon" className="w-5 h-5" />
              <span>My Assets</span>
            </div>
            <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
              <img src={ActivitiesIcon} alt="Activities Icon" className="w-5 h-5" />
              <span>Activities</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded font-semibold cursor-pointer">
              <img src={AiEcoCoachAltIcon} alt="AI Eco-Coach Icon" className="w-5 h-5" />
              <span>AI Eco-Coach</span>
            </div>
            <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded cursor-pointer">
              <img src={GoalsIcon} alt="Goals Icon" className="w-5 h-5" />
              <span>Goals</span>
            </div>
          </nav>

          {/* Impact Section */}
          <div className="mt-8 bg-[#E6F9ED] p-4 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 mb-1">IMPACT</p>
            <p className="text-sm text-black">This Month</p>
            <p className="text-sm text-[#16A34A] font-semibold">
              You're reducing emissions! -12% 🌱
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-t border-gray-200 text-sm">
          <div className="font-semibold">Beatrice Mwenje</div>
          <div className="text-gray-500">beatricemwenje@gmail.com</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Heading */}
        <div className="ml-8 mb-6 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <img src={AiEcoCoachIcon} alt="AI Eco-Coach Icon" className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-800">AI Eco-Coach</h1>
          </div>
          <p className="text-base text-gray-600">
            Get personalized insights and behavioral nudges
          </p>
        </div>

        {/* Coaching Cards */}
        <div className="ml-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {/* Card 1 */}
          <div className="bg-[#FFFFA1] p-4 rounded-lg shadow w-64 h-48 flex flex-col items-start">
            <img src={LightBulbIcon} alt="Light Bulb Icon" className="w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold text-[#867C00] mb-1">General Tips</h2>
            <p className="text-sm text-[#A79D21]">
              Get actionable eco-friendly suggestions
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#E6F5FF] p-4 rounded-lg shadow w-64 h-48 flex flex-col items-start">
            <img src={ExportTrendingDownIcon} alt="Trending Down Icon" className="w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold text-[#4B5A82] mb-1">Reduction Plan</h2>
            <p className="text-sm text-[#8695BD]">
              Strategies to cut emissions by 20%
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#DEFEFE] p-4 rounded-lg shadow w-64 h-48 flex flex-col items-start">
            <img src={ProgressionIcon} alt="Progress Icon" className="w-8 h-8 mb-2" />
            <h2 className="text-lg font-semibold text-[#3E7C64] mb-1">Progress Check</h2>
            <p className="text-sm text-[#648989]">
              Analyze your positive impact
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
