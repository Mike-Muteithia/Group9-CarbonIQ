import React from "react";
import goalIcon from "../assets/icons/goal.svg";
import pencilIcon from "../assets/icons/pencil.svg";
import deleteIcon from "../assets/icons/delete.svg";

const GoalCard = ({ title, description, start, end, targetCo2, progressCo2, percent, onEdit, onDelete }) => {
  const numericPercent = parseFloat(percent.replace("%", ""));

  return (
    <div className="bg-white w-full max-w-[850px] mx-auto rounded-[14px] border-2 border-gray-200 shadow-2xl px-6 py-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-[14px] bg-[#CBFFE0] mt-1">
            <img src={goalIcon} alt="Goal Icon" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <span className="bg-[#CBFFE0] text-green-700 text-xs font-medium px-3 py-0.5 rounded-[24px] w-fit mt-1">
              Active
            </span>
            <p className="mt-3 text-sm text-gray-800 max-w-4xl">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <img src={pencilIcon} alt="Edit" className="w-5 h-5 cursor-pointer" onClick={onEdit} />
<img src={deleteIcon} alt="Delete" className="w-5 h-5 cursor-pointer" onClick={onDelete} />

        </div>
      </div>

      <div className="flex justify-between items-end mt-4 ml-12">
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Target Reduction</span>
            <span className="font-semibold text-gray-900">{targetCo2}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>Progress</span>
            <span className="font-semibold text-[#0D4BD3]">{progressCo2}</span>
          </div>
          <div className="bg-gray-300 w-full h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-[#40CD74] h-full rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${numericPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Started: {start}</span>
            <span>Target: {end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
