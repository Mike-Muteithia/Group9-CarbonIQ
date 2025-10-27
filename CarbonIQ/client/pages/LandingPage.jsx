import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import HowItWorks from "../components/HowItWorks";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";


const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <FeatureGrid />
            <HowItWorks />
            <ContactUs />
            <Footer />
        </div>
    );
};

export default LandingPage;
