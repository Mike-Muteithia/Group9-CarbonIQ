import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, Activity, Bot, Target } from 'lucide-react';
import logo from '../assets/Logo.png'; // ensure this file exists at src/assets/

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('My Assets');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/Dashboard' },
    { name: 'My Assets', icon: Briefcase, path: '/MyAssets' },
    { name: 'Activities', icon: Activity, path: '/Activities' },
    { name: 'AI EcoCoach', icon: Bot, path: '/Ecocoach' },
    { name: 'Goals', icon: Target, path: '/Goals' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 h-screen shadow-sm">
        {/* Logo and Title */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <img src={logo} alt="CarbonIQ Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">CarbonIQ</h1>
              <p className="text-xs text-gray-500">Track • Analyze • Reduce</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setActiveItem(item.name)}
                      className={`flex items-center gap-3 px-6 py-3 w-full text-left rounded-lg transition-all duration-200 ease-in-out ${
                        activeItem === item.name
                          ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`w-5 h-5 ${activeItem === item.name ? 'text-green-600' : 'text-gray-500'}`}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm">{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Impact Section */}
        <div className="mx-4 mb-4 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-600 mb-1 font-medium">This Month</p>
          <p className="text-sm text-green-600 font-semibold">+12%</p>
          <p className="text-xs text-green-700">You're reducing emissions! 🌿</p>
        </div>

        {/* User Profile */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center font-medium">
            B
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900 truncate">Beatrice Mwangi</p>
            <p className="text-xs text-gray-500 truncate">bea@carboniq@gmail.com</p>
          </div>
        </div>
      </aside>

     
    </div>
  );
};

export default Sidebar;
