import React from "react";
import EmailIcon from "../assets/icons/EmailIcon";
import PhoneIcon from "../assets/icons/PhoneIcon";
import LocationIcon from "../assets/icons/LocationIcon";
import XIcon from "../assets/icons/XIcon";
import LinkedInIcon from "../assets/icons/LinkedInIcon";
import GithubIcon from "../assets/icons/GithubIcon";


const ContactUs = () => {
    return (
        <section
            id="contactus"
            className="relative w-full h-[686px] bg-[#2aab45] text-white px-8 py-12 flex flex-col justify-center">
            {/* Title */}
            <h2 className="font-jost font-bold text-[48px] leading-[69px] text-white mb-4">
                Contact Us
            </h2>

            {/* SubText */}
            <p className="font-jost font-bold text-[24px] leading-[35px] text-[#6eef89] max-w-[724px] mb-12">
                Have questions? We’d love to hear you. Send us a message and we’ll respond as soon as possible.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex items-center gap-4">
                    <div className="w-[64px] h-[49px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center">
                        <EmailIcon />
                    </div>
                    <div>
                        <h3 className="font-jost font-bold text-[17px] leading-[25px] text-white">
                            Email
                        </h3>
                        <p className="font-jost font-bold text-[14px] leading-[20px] text-[#6eef89] hover:text-white transition-colors">
                            support@carboniq.com
                        </p>
                    </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                    <div className="w-[64px] h-[49px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center">
                        <PhoneIcon />
                    </div>
                    <div>
                        <h3 className="font-jost font-bold text-[17px] leading-[25px] text-white">
                            Phone
                        </h3>
                        <p className="font-jost font-bold text-[14px] leading-[20px] text-[#6eef89] hover:text-white transition-colors">
                            +254 756 953 456
                        </p>
                    </div>
                </div>

                {/* Office */}
                <div className="flex items-center gap-4">
                    <div className="w-[64px] h-[49px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center">
                        <LocationIcon />
                    </div>
                    <div>
                        <h3 className="font-jost font-bold text-[17px] leading-[25px] text-white">
                            Office
                        </h3>
                        <p className="font-jost font-bold text-[14px] leading-[20px] text-[#6eef89] max-w-[466px] hover:text-white transition-colors">
                            Nairobi City, Westlands, Telkom Parklands Exchange, Floor 2, Room 14
                        </p>
                    </div>
                </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mt-12">
                <div aria-label="X" className="w-[54px] h-[54px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <XIcon />
                </div>
                <div aria-label="LinkedIn" className="w-[54px] h-[54px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <LinkedInIcon />
                </div>
                <div aria-label="Github" className="w-[54px] h-[54px] bg-[#23683a]/60 shadow-[0px_4px_4px_2px_rgba(0,0,0,0.25)] rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <GithubIcon />
                </div>
            </div>
        </section>
    );
};

export default ContactUs;

