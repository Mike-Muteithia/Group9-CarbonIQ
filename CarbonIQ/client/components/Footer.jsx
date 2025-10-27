import React from "react";
import CopywriteIcon from "../assets/icons/CopywriteIcon";
import logo from "../assets/logo.png"


const Footer = () => {
    return (
        <footer
            id="footer"
            className="relative w-full bg-white text-[#6e6e6e] px-16 py-12 font-jost"
        >
            <div className="max-w-[1248px] mx-auto">
                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
                    {/* Logo & Tagline */}
                    <div className="flex flex-col items-start">
                        <img 
                            src={logo} 
                            alt="CarbonIQ Logo"
                            className="w-[297px] h-[99px] object-contain mb-4"
                        />
                        <p className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] max-w-[267px]">
                            Track, analyze, and reduce your carbon footprint with 
                            AI-powered insights
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap gap-[172px]">
                        {/* Product */}
                        <div>
                            <h3 className="font-bold text-[16px] leading-[23px] text-black mb-3">
                                Product
                            </h3>
                            <ul className="space-y-2">
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Features
                                </li>
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    How It Works
                                </li>
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Dashboard
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-bold text-[16px] leading-[23px] text-black mb-3">
                                Company
                            </h3>
                            <ul className="space-y-2">
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Contact Us
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold text-[16px] leading-[23px] text-black mb-3">
                                Legal
                            </h3>
                            <ul className="space-y-2">
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Privacy Policy
                                </li>
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Terms of Service
                                </li>
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Cookie Policy
                                </li>
                                <li className="font-bold text-[14px] leading-[20px] text-[#6e6e6e] hover:text-black transition-colors">
                                    Sustainability
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-[#6e6e6e] my-8"></div>

                {/* Copywright */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center text-[#6e6e6e]">
                        <CopywriteIcon className="mr-2"/>
                        <p className="font-semi-bold text-[16px] leading-[23px] hover:text-black transition-colors">
                            2024 CarbonIQ. All rights reserved. Track. Reduce. Impact.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="flex gap-9 text-[16px] font-semibold text-[#6e6e6e]">
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <a href="#" className="hover:text-black transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
