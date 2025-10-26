import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

// Ensure these paths are correct in your project structure
const PencilIcon = new URL("../assets/icons/pencil.svg", import.meta.url).href;
const DeleteIcon = new URL("../assets/icons/delete.svg", import.meta.url).href;

// --- 1. GoalCard Component (FIXED: Progress Bar & Active Tag) ---
const GoalCard = ({ title, description, start, end, targetCo2, progressCo2, percent }) => {
  // Ensure 'percent' is treated as a number for the progress bar width
  const numericPercent = parseFloat(percent.replace("%", ""));

  return (
    <div className="bg-white w-full rounded-xl shadow-md px-6 py-5 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        {/* Left Side: Icon, Title, and Active Status */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full border border-green-500 flex items-center justify-center bg-white">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {/* FIX: RESTORED GREEN BACKGROUND FOR 'ACTIVE' STATUS */}
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1">
              active
            </span>
            <p className="mt-2 text-sm text-gray-700 max-w-2xl">{description}</p>
          </div>
        </div>

        {/* Right Side: Edit/Delete Icons */}
        <div className="flex gap-2 mt-1">
          <img src={PencilIcon} alt="Edit" className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-700" />
          <img src={DeleteIcon} alt="Delete" className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500" />
        </div>
      </div>
      
      {/* Progress and Target/Progress Data */}
      <div className="flex justify-between items-end mt-4">
        <div className="flex-1 mr-10">
          
          {/* Target Reduction */}
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span className="font-medium">Target Reduction</span>
            <span className="font-bold text-gray-900">{targetCo2}</span>
          </div>

          {/* Progress (Text) */}
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span className="font-medium">Progress</span>
            <span className="font-bold text-green-600">{progressCo2}</span>
          </div>
          
          {/* FIX: PROGRESS BAR RESTORED AND CORRECTLY PLACED */}
          <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden mb-2"> 
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${numericPercent}%` }}
            />
          </div>
          {/* END FIX */}
          
          {/* Started / Target Date */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Started: {start}</span>
            <span>Target: {end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- 2. Header Component (For Goals List View - Unchanged) ---
const Header = ({ onNewGoalClick }) => (
  <div className="flex justify-between items-center mb-2">
    <div>
      <h1 className="text-3xl font-bold text-[#1A1A1A]">Emission Goals</h1>
      <p className="text-sm text-gray-600 mt-1">Set targets and track your progress</p>
    </div>
    <button 
        onClick={onNewGoalClick}
        className="bg-[#19A64D] text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-colors hover:bg-green-700"
    >
      + New Goal
    </button>
  </div>
);


// --- 3. CreateGoalForm Component (Unchanged) ---
const CreateGoalForm = ({ onCancel, onSave }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-3xl mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h1>
        
        <div className="space-y-6">
            
            {/* Goal Title */}
            <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Title *</label>
                <input 
                    type="text" 
                    placeholder="e.g., Reduce emissions by 20% this quarter" 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-green-500 focus:border-green-500" 
                />
            </div>

            {/* Description */}
            <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                    rows="3" 
                    placeholder="Describe your emission reduction goal..." 
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-green-500 focus:border-green-500"
                ></textarea>
            </div>

            {/* Reduction Fields (Side-by-side) */}
            <div className="flex space-x-6 w-full">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Reduction (kg CO₂) *</label>
                    <input 
                        type="number" 
                        defaultValue="100.00" 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900" 
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Progress (kg CO₂)</label>
                    <input 
                        type="number" 
                        defaultValue="0" 
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900" 
                    />
                </div>
            </div>

            {/* Date Fields (Side-by-side) */}
            <div className="flex space-x-6 w-full">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input type="text" defaultValue="20/10/25" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date *</label>
                    <input type="text" placeholder="dd/mm/yyyy" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900" />
                </div>
            </div>
            
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
            <button 
                onClick={onCancel}
                className="flex items-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm"
            >
                <span className="text-xl mr-1">×</span> Cancel
            </button>
            <button 
                onClick={onSave}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
            >
                Create Goal
            </button>
        </div>
    </div>
);


// --- 4. Main EmissionGoals Component (Unchanged) ---
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
        <div className="grid grid-cols-[16rem_1fr] min-h-screen bg-[#F5F5F5] font-sans">
            <Sidebar />
            
            <main className="py-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 space-y-8">
                    
                    {isCreatingNewGoal ? (
                        <CreateGoalForm 
                            onCancel={() => setIsCreatingNewGoal(false)} 
                            onSave={() => setIsCreatingNewGoal(false)} 
                        />
                    ) : (
                        <>
                            <Header onNewGoalClick={() => setIsCreatingNewGoal(true)} />
                            
                            <div className="flex flex-col space-y-6">
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















