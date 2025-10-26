import React from "react";
import { Link, useLocation } from "react-router-dom";

// Icon imports (Your paths)
const DashboardIcon = new URL("../assets/icons/dashboardIcon.svg", import.meta.url).href;
const MyAssetsIcon = new URL("../assets/icons/myAssetsIcon.svg", import.meta.url).href;
const ActivitiesIcon = new URL("../assets/icons/activitiesIcon.svg", import.meta.url).href;
const AiEcoCoachAltIcon = new URL("../assets/icons/aiEcoCoachAltIcon.svg", import.meta.url).href;
const GoalsIcon = new URL("../assets/icons/goalsIcon.svg", import.meta.url).href;
const CarbonIQLogo = new URL("../assets/logos/CarbonIQLogo.svg", import.meta.url).href;

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/dashboard" },
    { icon: MyAssetsIcon, label: "My Assets", path: "/my-assets" },
    { icon: ActivitiesIcon, label: "Activities", path: "/activities" },
    { icon: AiEcoCoachAltIcon, label: "AI Eco-Coach", path: "/ai-eco-coach" },
    { icon: GoalsIcon, label: "Goals", path: "/goals" },
  ];

  return (
    // FIX: Removed 'fixed', 'w-64', 'top-0', 'left-0'. Use h-full to fill grid row.
    <aside className="h-full bg-white grid grid-rows-[auto_1fr_auto] font-jost shadow-xl border-r border-gray-100 z-10">
      
      {/* --- ROW 1: LOGO --- */}
      <div className="px-6 py-8">
        <div className="flex justify-start items-center">
          <img
            src={CarbonIQLogo}
            alt="CarbonIQ Logo"
            className="w-24 h-auto"
          />
        </div>
      </div>
      
      {/* --- ROW 2: MAIN CONTENT (Scrollable) --- */}
      <div className="relative overflow-y-auto px-6 flex flex-col"> 
        
        {/* --- NAVIGATION --- */}
        <div className="mt-16"> 
          <nav className="flex flex-col space-y-2">
            {navItems.map(({ icon, label, path }) => {
              const active = location.pathname === path;

              return (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 text-base w-full ${
                    active
                      ? "bg-[#E6F9ED] text-[#19A64D] font-semibold" 
                      : "text-black hover:bg-gray-100 hover:text-[#19A64D]"
                  }`}
                >
                  <img src={icon} alt={`${label} Icon`} className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* --- IMPACT SECTION --- */}
        <div className="flex flex-col space-y-3 w-[200px] mx-auto mt-auto mb-10"> 
          
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider self-start">
            IMPACT
          </p>
          
          <div className="w-full bg-[#E6F9ED] rounded-[12px] py-3 px-4 flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-black">This Month</p>
              <p className="text-sm font-bold text-[#16A34A]">-12%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-light text-black">
                You're reducing emissions!
              </p>
              <span role="img" aria-label="plant" className="text-lg leading-none">
                🌱
              </span>
            </div>
          </div>
        </div>
        
      </div>

      {/* --- ROW 3: FIXED BOTTOM USER PROFILE --- */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center gap-3 flex-shrink-0">
        
        <div className="w-10 h-10 rounded-full bg-[#19A64D] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
          B
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-gray-900 truncate">
              Beatrice Mwenje
            </p>
            <Link to="/profile" className="text-gray-400 hover:text-gray-700 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            beatricemwenje@gmail.com
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;