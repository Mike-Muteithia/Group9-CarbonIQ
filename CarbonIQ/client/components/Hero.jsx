import React from "react";
import hero from "../assets/hero.png";


const Hero = () => {
    return (
        <section
            id="home"
            className="relative bg-[#418856] text-white min-h-screen flex items-center overflow-hidden opacity-95"
        >
            {/* Background Img for Hero */}
            <img 
                src={hero} 
                alt="Futuristic Eco-tech Earth Illustration"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Content */}
            <div className="relative z-10 container mx-8 mb-40 mr-150 ml-8  py-70 flex flex-col md:flex-row items-center justify-between">
                {/* Text Section */}
                <div className="max-w-lg space-y-5 -mt-28">
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                        Track, Analyze, Act -- <br /> Your Carbon Footprint. Smarter.
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-white/90">
                        CarbonIQ helps you monitor, analyze, and reduce emissions with 
                        AI-powered insights and personalized eco-nudges.
                    </p>

                    {/* CTA Button */}
                    <button className="mt-6 inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md shadow-md font-semibold transition">
                        Get Started
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-7-7l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
