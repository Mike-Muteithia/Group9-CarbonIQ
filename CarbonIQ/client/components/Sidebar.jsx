import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Activity, Bot, Target, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import MetricsCard from './MetricsCard'; // Import MetricsCard

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const userId = 1; // Get this from auth context later

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Assets', icon: Briefcase, path: '/assets' },
    { name: 'Activities', icon: Activity, path: '/activities' },
    { name: 'AI EcoCoach', icon: Bot, path: '/ecocoach' },
    { name: 'Goals', icon: Target, path: '/goals' },
  ];

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 h-screen shadow-sm">
      {/* Logo and Navigation */}
      <div>
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="CarbonIQ Logo" 
            className="h-srceen w-[210px] object-contain" 
          />
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.name} className="hover:scale-105 transition-transform duration-300">
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

        {/* User Info + Logout */}
        <div className="px-4 py-3 border-t border-gray-200">
          {/* Profile */}
          <div className='flex items-center gap-3 mb-3'>
              <div className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center font-medium">
                {user ? user.name?.charAt(0).toUpperCase() || 'U' : 'U'}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user.name || 'User' : 'Loading...'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user ? user.email || '' : ''}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className='w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium text-sm py-2 rounded-md hover:bg-red-100 transition-colors'
            >
              <LogOut className='w-4 h-4'/>
              Log Out
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;