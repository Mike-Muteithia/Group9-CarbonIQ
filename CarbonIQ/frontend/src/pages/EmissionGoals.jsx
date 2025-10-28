import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

import goalIcon from '../assets/icons/goal.svg'; 
import pencilIcon from '../assets/icons/pencil.svg';
import deleteIcon from '../assets/icons/delete.svg';

const GoalCard = ({ title, description, start, end, targetCo2, progressCo2, percent }) => {
  const numericPercent = parseFloat(percent.replace("%", ""));

  return (
    <div className="bg-white w-full rounded-xl shadow-md px-8 py-6 border border-gray-200">
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
            <p className="mt-3 text-sm text-gray-700 max-w-4xl">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <img src={pencilIcon} alt="Edit" className="w-5 h-5 cursor-pointer" />
          <img src={deleteIcon} alt="Delete" className="w-5 h-5 cursor-pointer" />
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
          <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-[#40CD74] h-full rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${numericPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Started: {start}</span>
            <span>Target: {end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ onNewGoalClick }) => (
  <div className="flex justify-between items-center mb-10">
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">Emission Goals</h1>
      <p className="text-base text-gray-600 mt-1">Set targets and track your progress</p>
    </div>
    <button 
      onClick={onNewGoalClick}
      className="bg-[#19A64D] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 flex items-center space-x-1"
    >
      <span>+</span>
      <span>New Goal</span>
    </button>
  </div>
);

const CreateGoalForm = ({ onCancel, onSave }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h1>
    <div className="space-y-6">
      {/* Form fields unchanged */}
    </div>
    <div className="flex justify-end space-x-4 mt-8">
      <button onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium shadow-sm">
        <span className="text-xl mr-1">×</span> Cancel
      </button>
      <button onClick={onSave} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium shadow-md">
        Create Goal
      </button>
    </div>
  </div>
);

const EmissionGoals = () => {
  const [isCreatingNewGoal, setIsCreatingNewGoal] = useState(false);

  const goals = [
    {
      title: "Quarterly Fleet Optimization",
      description: "Reduce overall fleet emissions by optimizing routes and transitioning to more efficient vehicles.",
      start: "Oct 1, 2024",
      end: "Dec 31, 2024",
      targetCo2: "200 kg CO₂",
      progressCo2: "0.0%",
      percent: "0",
    },
    {
      title: "Reduce Monthly Emissions by 25%",
      description: "Aim to cut personal vehicle emissions through better route planning and increased EV usage.",
      start: "Dec 1, 2024",
      end: "Jan 31, 2025",
      targetCo2: "50 kg CO₂",
      progressCo2: "0.0%",
      percent: "0",
    },
  ];

  return (
    <div className="grid grid-cols-[16rem_1fr] min-h-screen bg-[#FAFFFF] font-sans">
      <Sidebar />
      <main className="py-8 overflow-y-auto">
        <div className="max-w-[950px] mx-auto px-4 sm:px-6 md:px-10 space-y-6">
          {isCreatingNewGoal ? (
            <CreateGoalForm 
              onCancel={() => setIsCreatingNewGoal(false)} 
              onSave={() => setIsCreatingNewGoal(false)} 
            />
          ) : (
            <>
              <Header onNewGoalClick={() => setIsCreatingNewGoal(true)} />
              <div className="flex flex-col gap-6">
                {goals.map((goal, index) => (
                  <GoalCard key={index} {...goal} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmissionGoals;
