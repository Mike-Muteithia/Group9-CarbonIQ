import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalsAPI } from '../services/api';

export default function Goals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_reduction_percentage: 10,
    end_date: ''
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Load goals and stats
  useEffect(() => {
    if (userId) {
      loadGoalsData();
    }
  }, [userId]);

  const loadGoalsData = async () => {
    try {
      setLoading(true);
      const [goalsData, statsData] = await Promise.all([
        goalsAPI.getUserGoals(userId),
        goalsAPI.getGoalStats(userId)
      ]);
      setGoals(goalsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    
    if (!newGoal.title.trim()) {
      alert('Please enter a goal title');
      return;
    }

    try {
      await goalsAPI.createGoal({
        user_id: userId,
        ...newGoal
      });
      
      setShowCreateModal(false);
      setNewGoal({
        title: '',
        target_reduction_percentage: 10,
        end_date: ''
      });
      
      // Reload goals
      loadGoalsData();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    }
  };

  // Update goal status
  const handleUpdateStatus = async (goalId, newStatus) => {
    try {
      await goalsAPI.updateGoal(goalId, { status: newStatus });
      loadGoalsData();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalsAPI.deleteGoal(goalId);
      loadGoalsData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get progress bar color
  const getProgressColor = (progress, onTrack) => {
    if (progress >= 100) return 'bg-green-500';
    if (onTrack) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Goals 🎯</h1>
            <p className="text-gray-600">Set and track your carbon reduction goals</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            + Create Goal
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Goals</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_goals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Active Goals</p>
              <p className="text-3xl font-bold text-green-600">{stats.active_goals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{stats.completed_goals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
              <p className="text-3xl font-bold text-purple-600">{stats.average_progress}%</p>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-6">Create your first carbon reduction goal to start tracking your progress!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                      {goal.on_track && goal.status === 'active' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ On Track
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Target: Reduce emissions by {goal.target_reduction_percentage}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {goal.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(goal.id, 'completed')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(goal.id, 'cancelled')}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{goal.current_progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getProgressColor(goal.current_progress, goal.on_track)}`}
                      style={{ width: `${Math.min(goal.current_progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Actual Reduction</p>
                    <p className="font-semibold text-gray-900">{goal.actual_reduction}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Days Active</p>
                    <p className="font-semibold text-gray-900">{goal.days_active} days</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Avg</p>
                    <p className="font-semibold text-gray-900">{goal.current_daily_avg} kg/day</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Baseline Avg</p>
                    <p className="font-semibold text-gray-900">{goal.baseline_daily_avg} kg/day</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-600">
                  <span>Started: {new Date(goal.start_date).toLocaleDateString()}</span>
                  {goal.end_date && (
                    <span>
                      {goal.days_remaining > 0
                        ? `${goal.days_remaining} days remaining`
                        : 'Deadline passed'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Goal</h2>
            <form onSubmit={handleCreateGoal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Reduce monthly emissions by 15%"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Reduction: {newGoal.target_reduction_percentage}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={newGoal.target_reduction_percentage}
                  onChange={(e) => setNewGoal({ ...newGoal, target_reduction_percentage: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={newGoal.end_date}
                  onChange={(e) => setNewGoal({ ...newGoal, end_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}