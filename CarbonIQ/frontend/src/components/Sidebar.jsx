import React from "react";

// Logo
const CarbonIQLogo = new URL("../assets/logos/CarbonIQLogo.svg", import.meta.url).href;

// Icons
const DashboardIcon = new URL("../assets/icons/dashboardIcon.svg", import.meta.url).href;
const AssetsIcon = new URL("../assets/icons/myAssetsIcon.svg", import.meta.url).href;
const ActivitiesIcon = new URL("../assets/icons/activitiesIcon.svg", import.meta.url).href;
const CoachIcon = new URL("../assets/icons/aiecocoachicon.svg", import.meta.url).href;
const GoalsIcon = new URL("../assets/icons/goalsIcon.svg", import.meta.url).href;

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", icon: DashboardIcon },
    { name: "My Assets", icon: AssetsIcon },
    { name: "Activities", icon: ActivitiesIcon },
    { name: "AI Eco-Coach", icon: CoachIcon },
    { name: "Goals", icon: GoalsIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between py-6 relative">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-12">
        <div className="w-9 h-9 rounded-md bg-[#E8F5EE] flex items-center justify-center">
          <img src={CarbonIQLogo} alt="CarbonIQ Logo" className="w-6 h-6" />
        </div>
      </div>

      {/* Navigation - spacing + locked text color */}
      <div className="absolute top-[260px] left-1/2 transform -translate-x-1/2 space-y-10 w-[85%]">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className="flex items-center gap-6 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-neutral-50 no-underline"
          >
            <img src={item.icon} alt={`${item.name} Icon`} className="w-5 h-5" />
            <span className="text-black !text-black">{item.name}</span>
          </a>
        ))}
      </div>

      {/* Footer section */}
      <div className="px-6 mt-auto space-y-4 flex flex-col items-center text-center">
        {/* Impact label */}
        <h3 className="text-xs text-neutral-500">IMPACT</h3>

        {/* Impact box */}
        <div className="bg-[#E8F5EE] rounded-[12px] p-4 w-[200px] text-sm text-center">
          <div className="flex justify-between text-neutral-700 mb-1">
            <span>This Month</span>
            <span className="font-semibold" style={{ color: "#16A34A" }}>-12%</span>
          </div>
          <p className="text-xs text-neutral-500">You're reducing emissions! 🌱</p>
        </div>

        {/* User info */}
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-black">Beatrice Mwenje</p>
          <a
            href="/signin"
            className="text-xs text-[#2563EB] hover:underline transition-colors no-underline"
          >
            beatrice.mwenje@gmail.com
          </a>
        </div>
      </div>
    </aside>
  );
}
