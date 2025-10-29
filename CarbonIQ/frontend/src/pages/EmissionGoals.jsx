  import React, { useState } from "react";

import goalIcon from "../assets/icons/goal.svg";
import pencilIcon from "../assets/icons/pencil.svg";
import deleteIcon from "../assets/icons/delete.svg";
import goalsIcon from "../assets/icons/Goals.svg";

const GoalCard = ({ title, description, start, end, targetCo2, progressCo2, percent }) => {
  const numericPercent = parseFloat(percent.replace("%", ""));

  return (
    <div className="bg-white w-full max-w-[850px] mx-auto rounded-[14px] border-2 border-gray-200 shadow-2xl px-5 py-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-[14px] bg-[#CBFFE0] mt-1">
            <img src={goalIcon} alt="Goal Icon" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <span className="bg-[#CBFFE0] text-green-700 text-xs font-medium px-3 py-0.5 rounded-[24px] w-fit mt-1">
              Active
            </span>
            <p className="mt-2 text-sm text-gray-800 max-w-4xl">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <img src={pencilIcon} alt="Edit" className="w-5 h-5 cursor-pointer" />
          <img src={deleteIcon} alt="Delete" className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-between items-end mt-2 ml-12">
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Target Reduction</span>
            <span className="font-semibold text-gray-900">{targetCo2}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-[#0D4BD3]">{progressCo2}</span>
          </div>
          <div className="bg-gray-300 w-full h-2 rounded-full overflow-hidden mb-1">
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

const Header = ({ onNewGoalClick }) => (
  <div className="w-full max-w-[850px] mx-auto px-6 sm:px-8 md:px-10 lg:px-12 mb-10">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">Emission Goals</h1>
      <button
        onClick={onNewGoalClick}
        className="bg-[#19A64D] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 flex items-center space-x-1"
      >
        <span>+</span>
        <span>New Goal</span>
      </button>
    </div>
    <p className="text-base text-gray-600 mt-1">Set targets and track your progress</p>
  </div>
);

const EmptyState = () => (
  <div className="bg-white w-full max-w-[850px] mx-auto rounded-[12px] border border-gray-300 shadow-2xl px-10 py-16 text-center">
    <div className="flex justify-center mb-6 pt-2">
      <img src={goalsIcon} alt="Goals Icon" className="w-12 h-12 opacity-60" />
    </div>
    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Goals Yet</h2>
    <p className="text-sm text-gray-500">
      Set your first emission reduction goal to track your progress.
    </p>
  </div>
);

const CreateGoalForm = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetCo2, setTargetCo2] = useState("");
  const [progressCo2, setProgressCo2] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      setShowError(true);
      return;
    }

    const newGoal = {
      title,
      description,
      start: startDate,
      end: endDate,
      targetCo2: `${targetCo2} kg CO₂`,
      progressCo2: `${progressCo2} kg CO₂`,
      percent: "0"
    };

    onSave(newGoal);
  };

  return (
<div className="bg-white p-8 rounded-[14px] shadow-2xl border border-gray-200 w-full max-w-[914px] mx-auto px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Goal</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
        <input
  type="text"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value);
    setShowError(false);
  }}
  placeholder="e.g., Reduce emissions by 20% this quarter"
  className={`w-full max-w-[826px] h-[44px] bg-[#ECECEC] rounded-md px-4 py-2 text-sm text-gray-800 mx-auto ${showError ? "border border-red-500" : "border border-gray-300"}`}
/>

          {showError && (
  <p className="text-red-500 text-sm mt-1 animate-fade-in-up">
    Goal title is required before submission.
  </p>
)}
          
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
         <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Describe your emission reduction goal..."
  className="w-full max-w-[827px] h-[81px] bg-[#ECECEC] border border-[#C4C4C4] rounded-[6px] px-4 py-2 text-sm text-gray-800 mx-auto resize-none"
/>
          
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Reduction (kg CO₂)</label>
           <input
  type="number"
  value={targetCo2}
  onChange={(e) => setTargetCo2(e.target.value)}
  className="w-full max-w-[396px] h-[44px] bg-[#ECECEC] border border-[#C4C4C4] rounded-[6px] px-4 py-2 text-sm text-gray-800 mx-auto"
/>

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Progress (kg CO₂)</label>
           <input
  type="number"
  value={progressCo2}
  onChange={(e) => setProgressCo2(e.target.value)}
  className="w-full max-w-[396px] h-[44px] bg-[#ECECEC] border border-[#C4C4C4] rounded-[6px] px-4 py-2 text-sm text-gray-800 mx-auto"
/>

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
           <input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  className="w-full max-w-[396px] h-[44px] bg-[#ECECEC] border border-[#C4C4C4] rounded-[6px] px-4 py-2 text-sm text-gray-800 mx-auto"
/>

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date *</label>
            <input
            
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
  className="w-full max-w-[396px] h-[44px] bg-[#ECECEC] border border-[#C4C4C4] rounded-[6px] px-4 py-2 text-sm text-gray-800 mx-auto"
/>

          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
  onClick={onCancel}
  className="w-full max-w-[160px] h-[44px] bg-white text-gray-700 border border-[#C4C4C4] rounded-[6px] shadow-md hover:bg-gray-100 text-sm font-medium mx-auto"
>
  <span className="text-xl mr-1">×</span> Cancel
</button>

        <button
  onClick={handleSubmit}
  className="w-full max-w-[160px] h-[44px] bg-[#19A64D] text-white rounded-[6px] shadow-md hover:bg-green-700 text-sm font-medium mx-auto"
>
  Create Goal
</button>

      </div>
    </div>
  );
};
const EmissionGoals = () => {
  const [isCreatingNewGoal, setIsCreatingNewGoal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingGoalData, setEditingGoalData] = useState(null);

  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.id);
    setEditingGoalData(goal);
    setIsCreatingNewGoal(true);
  };

  const handleUpdateGoal = (goalData) => {
    fetch(`http://localhost:5000/api/goals/${editingGoalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: goalData.title,
        target_reduction: parseFloat(goalData.targetCo2),
        deadline: goalData.end,
        description: goalData.description,
        start: goalData.start,
        end: goalData.end,
        progressCo2: goalData.progressCo2,
        percent: goalData.percent
      })
    })
      .then(res => res.json())
      .then(updatedGoal => {
        setGoals(prev => prev.map(g => g.id === editingGoalId ? updatedGoal : g));
        setIsCreatingNewGoal(false);
        setEditingGoalId(null);
        setEditingGoalData(null);
      })
      .catch(err => console.error("Failed to update goal:", err));
  };

  const handleDeleteGoal = (goalId) => {
    fetch(`http://localhost:5000/api/goals/${goalId}`, {
      method: "DELETE"
    })
      .then(() => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
      })
      .catch(err => console.error("Failed to delete goal:", err));
  };

 const handleCreateGoal = (goalData) => {
  fetch("http://localhost:5000/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: 1,// Replace with actual user ID
      title: goalData.title,
      target_reduction: parseFloat(goalData.targetCo2),
      deadline: goalData.end,
      description: goalData.description,
      start: goalData.start,
      end: goalData.end,
      progressCo2: goalData.progressCo2,
      percent: goalData.percent
    })
  })
    .then(res => res.json())
    .then(newGoal => {
      setGoals(prev => [...prev, newGoal]);
      setIsCreatingNewGoal(false);
    })
    .catch(err => console.error("Failed to create goal:", err));
};


  return (
   <div className="min-h-screen bg-gray-100 font-sans py-8 overflow-y-auto">
  <div className="w-full px-6 sm:px-8 md:px-10 lg:px-12 max-w-[850px] mx-auto space-y-6">

        <Header onNewGoalClick={() => setIsCreatingNewGoal(true)} />

        {isCreatingNewGoal && (
          <CreateGoalForm
            onCancel={() => setIsCreatingNewGoal(false)}
            onSave={handleCreateGoal}
          />
        )}

        {!isCreatingNewGoal && goals.length === 0 ? (
          <EmptyState />
        ) : goals.length > 0 ? (
          <div className="flex flex-col gap-16 px-6 sm:px-8 md:px-10 lg:px-12 mt-10">
            {goals.map((goal, index) => (
              <GoalCard key={index} {...goal} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EmissionGoals;