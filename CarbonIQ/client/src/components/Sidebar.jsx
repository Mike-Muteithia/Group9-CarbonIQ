import React, { useState } from 'react';
import { LayoutDashboard, Briefcase, Activity, Bot, Target } from 'lucide-react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('My Assets');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Assets', icon: Briefcase, path: '/assets' },
    { name: 'Activities', icon: Activity, path: '/activities' },
    { name: 'AI EcoCoach', icon: Bot, path: '/eco-coach' },
    { name: 'Goals', icon: Target, path: '/goals' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0">
      {/* Logo and Title */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">CarbonIQ</h1>
            <p className="text-xs text-gray-500">Track • Analyse • Reduce</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`flex items-center gap-3 px-6 py-3 w-full text-left rounded-lg transition-all ${
                    activeItem === item.name
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      activeItem === item.name ? 'text-green-600' : 'text-gray-500'
                    }`}
                  />
                  <span className="text-sm">{item.name}</span>
                </button>
              </li>
            ))}
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
          <p className="text-sm font-semibold text-gray-900 truncate">
            Beatrice Mwangi
          </p>
          <p className="text-xs text-gray-500 truncate">bea@carboniq@gmail.com</p>
        </div>
      </div>
    </aside>
  );
}
