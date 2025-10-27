import React from "react";
import AiCoachIcon from "../assets/icons/AiCoachIcon";
import MultiAssetIcon from "../assets/icons/MultiAssetIcon";

const features = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18V16H18.6L13.4 10.85L9.4 14.85L2 7.4L3.4 6L9.4 12L13.4 8L20 14.6V12H22V18H16Z" fill="#3BB043"/>
            </svg>

        ),
        title: "Real-Time Tracking",
        desc: "Monitor emissions from vehicles, aircraft, and machinery with automatic CO₂"
    },
    {
        icon: <AiCoachIcon />,
        title: "AI Eco Coach",
        desc: "Get personalized behavioral nudges and actionable insights to reduce your impact"
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18ZM10 16C8.33333 16 6.91667 15.4167 5.75 14.25C4.58333 13.0833 4 11.6667 4 10C4 8.33333 4.58333 6.91667 5.75 5.75C6.91667 4.58333 8.33333 4 10 4C11.6667 4 13.0833 4.58333 14.25 5.75C15.4167 6.91667 16 8.33333 16 10C16 11.6667 15.4167 13.0833 14.25 14.25C13.0833 15.4167 11.6667 16 10 16ZM10 14C11.1 14 12.0417 13.6083 12.825 12.825C13.6083 12.0417 14 11.1 14 10C14 8.9 13.6083 7.95833 12.825 7.175C12.0417 6.39167 11.1 6 10 6C8.9 6 7.95833 6.39167 7.175 7.175C6.39167 7.95833 6 8.9 6 10C6 11.1 6.39167 12.0417 7.175 12.825C7.95833 13.6083 8.9 14 10 14ZM10 12C9.45 12 8.97917 11.8042 8.5875 11.4125C8.19583 11.0208 8 10.55 8 10C8 9.45 8.19583 8.97917 8.5875 8.5875C8.97917 8.19583 9.45 8 10 8C10.55 8 11.0208 8.19583 11.4125 8.5875C11.8042 8.97917 12 9.45 12 10C12 10.55 11.8042 11.0208 11.4125 11.4125C11.0208 11.8042 10.55 12 10 12Z" fill="#3BB043"/>
            </svg>

        ),
        title: "Goal-Setting",
        desc: "Set reduction targets and track progress with beautiful visualizations"
    },
    {
        icon: <MultiAssetIcon />,
        title: "Multi-Asset Support",
        desc: "Track emissions from cars, trucks, planes, and industrial equipment"
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.92498 21.125L7.44998 16.525L2.84998 14.05L4.62498 12.3L8.24998 12.925L10.8 10.375L2.87498 7L4.97498 4.85L14.6 6.55L17.7 3.45C18.0833 3.06667 18.5583 2.875 19.125 2.875C19.6916 2.875 20.1666 3.06667 20.55 3.45C20.9333 3.83333 21.125 4.30417 21.125 4.8625C21.125 5.42083 20.9333 5.89167 20.55 6.275L17.425 9.4L19.125 19L17 21.125L13.6 13.2L11.05 15.75L11.7 19.35L9.92498 21.125Z" fill="#3BB043"/>
            </svg>

        ),
        title: "Detailed Analytics",
        desc: "View comprehensive insights, top emitters, and activity summaries"
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21V3H12V7H22V21H2ZM4 19H10V17H4V19ZM4 15H10V13H4V15ZM4 11H10V9H4V11ZM4 7H10V5H4V7ZM12 19H20V9H12V19ZM14 13V11H18V13H14ZM14 17V15H18V17H14Z" fill="#3BB043"/>
            </svg>

        ),
        title: "Business Ready",
        desc: "Perfect for organizations managing fleets and monitoring equipment emissions"
    },
];


const FeatureGrid = () => {
    return (
        <section
            id="features"
            className="relative w-full bg-[#3bb043] py-20 px-6 text-white font-jost"
        >
            {/* Header */}
            <div className="text-center mb-14">
                <h2 className="text-4xl font-bold mb-2">Key Features</h2>
                <p className="text-lg font-semibold text-white/90">
                    Technology that Empowers You to Make Every Action Count 
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-[#3bb043] border border-[#82bf89] shadow-md rounded-[28px] p-6 hover:scale-105 transition-transform duration-300 ease-out"    
                    >
                        {/* Icon */}
                        <div className="bg-[#95ff9d] w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-[#3bb043] hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>

                        {/* Text */}
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

                        {/* Description */}
                        <p className="text-white text-sm font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};


export default FeatureGrid;
