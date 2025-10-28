import React from 'react';
import { useNavigate } from 'react-router-dom';

import dashboardIcon from '../assets/icons/dashboardIcon.svg';
import myAssetsIcon from '../assets/icons/myAssetsIcon.svg';
import activitiesIcon from '../assets/icons/activitiesIcon.svg';
import aiEcoCoachIcon from '../assets/icons/aiecocoachicon.svg'; 
import goalsIcon from '../assets/icons/goalsIcon.svg';
import CarbonIQLogo from '../assets/logos/CarbonIQLogo.svg';

const Sidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', icon: dashboardIcon, link: '/dashboard' },
        { name: 'My Assets', icon: myAssetsIcon, link: '/myassets' },
        { name: 'Activities', icon: activitiesIcon, link: '/activities' },
        { name: 'AI Eco-Coach', icon: aiEcoCoachIcon, link: '/aiecocoach' }, 
        { name: 'Goals', icon: goalsIcon, link: '/goals' },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-white px-6 py-6 justify-between">
            
            {/* Top Section */}
            <div className="space-y-8">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <img src={CarbonIQLogo} alt="CarbonIQ Logo" className="h-8" />
                </div>

                {/* Navigation — now centered */}
                <nav className="flex flex-col items-center space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.link)}
                            className="group flex items-center gap-3 text-black transition-all duration-300 hover:text-[#19A64D] active:font-bold focus:outline-none"
                        >
                            <img 
                                src={item.icon} 
                                alt={`${item.name} Icon`} 
                                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-125" 
                            />
                            <span className="text-sm font-medium">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Middle Section: Impact */}
            <div className="mt-10">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-2 text-center">IMPACT</h3>
                <div className="flex justify-center">
                    <div className="bg-[#E6F9ED] text-[#16A34A] w-[204px] h-[100px] rounded-[12px] px-4 py-3 text-sm font-medium">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>This Month</span>
                            <span>-12%</span>
                        </div>
                        <p className="mt-1 text-sm">
                            You're reducing emissions! 🌱
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Section: User Info */}
            <div className="mt-auto pt-6">
                <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A4C23] flex items-center justify-center text-white font-bold text-base">B</div> 
                        <div className="text-sm">
                            <div className="font-semibold text-gray-900">Beatrice Mwenje</div>
                            <div className="text-xs text-gray-600">beatricemwenje@gmail.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
