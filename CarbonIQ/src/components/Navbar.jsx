import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";


const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm fixed w-full z-50">
            <div className="container mx-auto px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <img 
                        src={logo} 
                        alt="CarbonIQ Logo" 
                        className="h-16 w-auto object-contain" 
                    />
                </div>

                {/* Nav Links */}
                <ul className="hidden md:flex space-x-8 text-gray-600 font-medium text-[0.84rem] tracking-wide lg:ml-75">
                    <li>
                        <a href="#home" className="hover:text-green-600">Home</a>
                    </li>
                    <li>
                        <a href="#features" className="hover:text-green-600">Features</a>
                    </li>
                    <li>
                        <a href="#howitworks" className="hover:text-green-600">How It Works</a>
                    </li>
                    <li>
                        <a href="#contact" className="hover:text-green-600">Contact</a>
                    </li>
                </ul>

                {/* CTA Buttons */}
                <div className="hidden md:flex space-x-3">
                    <Link 
                        to="/login" 
                        className="px-4.5 py-2 border border-green-600 text-green-600 text-[0.80rem] rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/signup"
                        className="px-4.5 py-2 bg-green-600 text-white text-[0.80rem] rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



