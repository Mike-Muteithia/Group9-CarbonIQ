import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Activity, Bot, Target } from 'lucide-react';
import logo from '../assets/Logo.png';
import MetricsCard from './components/MetricsCard'; // Import MetricsCard

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const userId = 1; // Get this from auth context later

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Assets', icon: Briefcase, path: '/assets' },
    { name: 'Activities', icon: Activity, path: '/activities' },
    { name: 'AI EcoCoach', icon: Bot, path: '/ecocoach' },
    { name: 'Goals', icon: Target, path: '/goals' },
  ];

  return (
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
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveItem(item.name)}
                    className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        {/* Impact Section - Now using MetricsCard */}
        <MetricsCard userId={userId} />

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
      </div>
    </aside>
  );
};

export default Sidebar;