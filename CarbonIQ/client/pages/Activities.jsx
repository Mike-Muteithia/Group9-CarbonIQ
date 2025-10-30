import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddActivityModal from '../components/AddActivityModal';
import { activitiesAPI } from '../services/api';

export default function Activities() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_activities: 0,
    this_month: 0,
    by_category: []
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingActivity, setEditingActivity] = useState(null);

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

  // Fetch activities from backend
  const fetchActivities = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [activitiesData, statsData] = await Promise.all([
        activitiesAPI.getActivities(userId, selectedCategory !== 'all' ? selectedCategory : null),
        activitiesAPI.getActivityStats(userId)
      ]);
      
      setActivities(activitiesData.activities || activitiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load activities on component mount and when category changes
  useEffect(() => {
    fetchActivities();
  }, [userId, selectedCategory]);

  // Handle create activity
  const handleCreateActivity = async (activityData) => {
    try {
      await activitiesAPI.createActivity({
        ...activityData,
        user_id: userId
      });
      await fetchActivities(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async (activityId, activityTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${activityTitle}"?`)) {
      return;
    }

    try {
      await activitiesAPI.deleteActivity(activityId);
      await fetchActivities(); // Refresh the list
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
    }
  };

  // Category filter options
  const categories = [
    { value: 'all', label: 'All Activities', icon: '📋' },
    { value: 'transport', label: 'Transportation', icon: '🚗' },
    { value: 'energy', label: 'Energy', icon: '⚡' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'waste', label: 'Waste', icon: '🗑️' },
  ];

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      transport: 'bg-blue-100 text-blue-700',
      energy: 'bg-yellow-100 text-yellow-700',
      food: 'bg-green-100 text-green-700',
      waste: 'bg-gray-100 text-gray-700',
      other: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || colors.other;
  };

  // Loading state
  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading activities...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Activities</h1>
            <p className="text-gray-600">Track and manage your carbon-emitting activities</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition hover:scale-105 shadow-sm"
          >
            <span className="text-lg font-bold">+</span>
            <span>Log Activity</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_activities}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.this_month}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-3xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{stats.by_category?.length || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-3xl">🏷️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-500 mb-6">
              {selectedCategory === 'all'
                ? 'Get started by logging your first activity'
                : `No ${selectedCategory} activities found`}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition hover:scale-105"
            >
              Log Your First Activity
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${activity.iconBg || 'bg-green-500'} rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                        {activity.icon || '📝'}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {activity.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded ${getCategoryColor(activity.badge)}`}>
                            {activity.badge || 'other'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                            </svg>
                            <span>{activity.date}</span>
                          </div>
                          {activity.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <span>{activity.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Emission Amount & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {activity.amount}
                        </p>
                        <p className="text-xs text-gray-500">{activity.unit}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteActivity(activity.id, activity.title)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete activity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Activity Modal */}
        {isModalOpen && (
          <AddActivityModal
            activity={editingActivity}
            onSubmit={handleCreateActivity}
            onClose={() => {
              setIsModalOpen(false);
              setEditingActivity(null);
            }}
          />
        )}
      </div>
    </div>
  );
}