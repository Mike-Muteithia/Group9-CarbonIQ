import React from 'react';
import { Edit3, Trash2, CheckCircle } from 'lucide-react';

const GoalCard = ({ goal }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">{goal.title}</h2>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
            Active
          </span>
        </div>
        <div className="flex gap-3 text-gray-500">
          <Edit3 className="cursor-pointer hover:text-green-600" size={18} />
          <Trash2 className="cursor-pointer hover:text-red-600" size={18} />
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

      <div className="text-sm text-gray-700 mb-2">Progress</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <p>Started: {goal.startDate}</p>
        <p>
          {goal.emissionTarget} &nbsp; | &nbsp; Target: {goal.targetDate}
        </p>
      </div>
    </div>
  );
};

export default GoalCard;
