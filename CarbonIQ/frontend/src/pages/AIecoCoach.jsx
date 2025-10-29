import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import CoachingCard from "../components/CoachingCard";
import confetti from "canvas-confetti";

// Icons
const LightBulbIcon = new URL("../assets/icons/lightBulb.svg", import.meta.url).href;
const ExportTrendingDownIcon = new URL("../assets/icons/exportTrendingDown.svg", import.meta.url).href;
const ProgressionIcon = new URL("../assets/icons/progressionIcon.svg", import.meta.url).href;
const AiEcoCoachIcon = new URL("../assets/icons/aiEcoCoachIcon.svg", import.meta.url).href;

export default function AIecoCoach() {
  const outletContext = useOutletContext() || {};
  const { setChatOpen = () => {}, setMessages = () => {} } = outletContext;

  const [showTips, setShowTips] = useState(false);
  const [completedTips, setCompletedTips] = useState([]);
  const [showPlan, setShowPlan] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalSet, setGoalSet] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [hasActivities, setHasActivities] = useState(false); // simulate activity state

  const tips = [
    "Turn off lights when not in use",
    "Use public transport or carpool",
    "Reduce meat consumption",
    "Unplug devices when idle"
  ];

  const handleComplete = (index) => {
    if (!completedTips.includes(index)) {
      setCompletedTips([...completedTips, index]);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    setChatOpen(true);
    setMessages([]);
  }, []);

  return (
    <main className="bg-carbonGray px-6 pt-6 pb-2 min-h-screen flex justify-end relative">
      <div className="bg-white rounded-[12px] shadow-2xl px-8 py-8 max-w-[1000px] w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-md bg-[#E8F5EE] flex items-center justify-center">
            <img src={AiEcoCoachIcon} alt="AI Eco-Coach Icon" className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-carbonText">AI Eco-Coach</h1>
        </div>

        <p className="text-base text-gray-600 mb-6">
          Get personalized insights and behavioral nudges to reduce your carbon footprint.
        </p>

        {/* Coaching Cards */}
        <div className="relative">
          <div className={`flex justify-between gap-6 transition-all duration-300 ${!hasActivities ? "pointer-events-none blur-sm opacity-40" : ""}`}>
            <CoachingCard
              bgColor="#FEF9C3"
              textColor="#867C00"
              subColor="#A79D21"
              icon={LightBulbIcon}
              title="General Tips"
              text="Climate insights and friendly suggestions."
              onClick={() => hasActivities && setShowTips(true)}
            />
            <CoachingCard
              bgColor="#DBEAFE"
              textColor="#4B5A82"
              subColor="#8695BD"
              icon={ExportTrendingDownIcon}
              title="Reduction Plan"
              text="Strategize to cut emissions by 20%."
              onClick={() => hasActivities && setShowPlan(true)}
            />
            <CoachingCard
              bgColor="#D1FAE5"
              textColor="#3E7C64"
              subColor="#648989"
              icon={ProgressionIcon}
              title="Emission Progress"
              text="Analyze your emission profile."
              onClick={() => hasActivities && setShowProgress(true)}
            />
          </div>

          {/* Blocking Overlay Card */}
          {!hasActivities && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-8 z-40">
              <div className="bg-white rounded-[14px] shadow-xl border border-gray-200 max-w-[500px] w-full px-8 py-10 text-center">
                <div className="text-2xl mb-4 text-gray-400">✨</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Tracking Activities</h2>
                <p className="text-sm text-gray-500">
                  Log some activities first, and I’ll provide personalized insights and recommendations!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips Modal */}
        {showTips && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-carbonText">General Climate Tips</h2>
              {hasActivities ? (
                <>
                  <ul className="space-y-2 mb-4">
                    {tips.map((tip, index) => (
                      <li
                        key={index}
                        className={`flex items-center justify-between px-3 py-2 rounded ${
                          completedTips.includes(index)
                            ? "bg-green-100 line-through text-green-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <span>{tip}</span>
                        {!completedTips.includes(index) && (
                          <button
                            onClick={() => handleComplete(index)}
                            className="text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                          >
                            Done
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {completedTips.length === tips.length && (
                    <div className="text-green-700 font-semibold text-center mb-4">
                      🌱 Well done! You’ve completed all your eco tips!
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">No tips available. Log activities to get suggestions.</p>
              )}
              <button
                onClick={() => setShowTips(false)}
                className="mt-2 px-4 py-2 bg-carbonText text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Plan Modal */}
        {showPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-carbonText">Set Your Reduction Goal</h2>
              {hasActivities ? (
                <>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Choose a target:</label>
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                  >
                    <option value="">Select goal</option>
                    <option value="10">Reduce by 10%</option>
                    <option value="20">Reduce by 20%</option>
                    <option value="30">Reduce by 30%</option>
                  </select>
                  {goalSet && (
                    <div className="mb-4">
                      <p className="text-green-700 font-semibold mb-2">
                        🎯 Goal set: Reduce emissions by {selectedGoal}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${selectedGoal}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => selectedGoal && setGoalSet(true)}
                    className="mt-4 px-4 py-2 bg-carbonText text-white rounded hover:bg-gray-800"
                  >
                    Set Goal
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">Log activities to set a reduction goal.</p>
              )}
              <button
                onClick={() => {
                  setShowPlan(false);
                  setSelectedGoal("");
                  setGoalSet(false);
                }}
className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
>
  Close
</button>
</div>
</div>
)}
        {/* Progress Modal */}
        {showProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-carbonText">Emission Progress</h2>
              {hasActivities ? (
                <>
                  <p className="text-gray-700 mb-2">Your current CO₂ emissions:</p>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    You’ve reduced 35% from your baseline. Keep going!
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No progress data available. Log activities to begin tracking.</p>
              )}
              <button
                onClick={() => setShowProgress(false)}
                className="mt-2 px-4 py-2 bg-carbonText text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div> 
    </main> 
  );
} 
