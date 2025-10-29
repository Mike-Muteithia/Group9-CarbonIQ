import React from "react";

export default function CoachingCard({ bgColor, textColor, subColor, icon, title, text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-[288px] h-[144px] rounded-[12px] shadow-lg p-4 text-center flex flex-col justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <img src={icon} alt={title} className="mx-auto mb-2 h-8 w-8" />
      <h2 className="text-base font-bold mb-1">{title}</h2>
      <p style={{ color: subColor }} className="text-sm">{text}</p>
    </div>
  );
}
