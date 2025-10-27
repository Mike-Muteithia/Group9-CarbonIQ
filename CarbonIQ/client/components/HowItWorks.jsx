import React from "react";
import StepAiCoachIcon from "../assets/icons/StepAiCoachIcon";

const steps = [
    {
        id: 1,
        title: "Sign Up & Add Assets",
        desc: "Create your account and add your vehicles, aircraft, or machines to start tracking",
        icon: (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#6EEF89"
            >
                <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
            </svg>
        ),
    },
    {
        id: 2,
        title: "Log Activities",
        desc: "Record trips, flights, and machines runtime with distance and fuel data",
        icon: <StepAiCoachIcon />,
    },
    {
        id: 3,
        title: "View Analytics",
        desc: "See automatic CO₂ calculations and beautiful visualizations of your emissions",
        icon: (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#6EEF89"
            >
                <path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
            </svg>
        ),
    },
    {
        id: 4,
        title: "Get AI Insights",
        desc: "Receive personalized recommendations to reduce emissions and meet your goals",
        icon: (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#6EEF89"
            >
                <path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"/>
            </svg>
        ),
    },
];

const HowItWorks = () => {
    return (
        <section 
            id="howitworks" 
            className="relative bg-[#37af44] text-white py-20 px-6 font-jost"
        >
            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-[36px] font-bold leading-[52px] mb-2">
                    How It Works
                </h2>
                <p className="text-[20px] font-semibold leading-[29px] text-white/90 max-w-[620px] mx-auto">
                    Get started in minutes and begin your journey to carbon neutrality
                </p>
            </div>

            {/* Steps Grid */}
            <div className="flex flex-wrap justify-center gap-6 px-6">
                {steps.map((step) => (
                    <div 
                        key={step.id}
                        className="relative flex flex-col items-center text-center w-[300px] h-[390px] bg-[#72ea7f]/30 border border-white/40 shadow-md rounded-[12px] transition-transform duration-300 hover:scale-105"
                    >
                        {/* Step Number Circle */}
                        <div className="absolute -top-10 w-24 h-24 bg-[#24693d]/80 rounded-full flex items-center justify-center text-4xl font-bold">
                            {step.id}
                        </div>

                        {/* Step Icon */}
                        <div className="mt-20 mb-4 w-[88px] h-[88px] bg-[#0f871c]/60 rounded-[14px] flex items-center justify-center">
                            {step.icon}
                        </div>

                        {/* Step Title */}
                        <h3 className="text-[20px] font-bold leading-[29px] mb-2">
                            {step.title}
                        </h3>

                        {/* Step Description */}
                        <p className="text-[14px] font-medium leading-[20px] text-center max-w-[226px]">
                            {step.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};


export default HowItWorks;
