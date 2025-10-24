import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";


const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <FeatureGrid />
        </div>
    );
};

export default LandingPage;
