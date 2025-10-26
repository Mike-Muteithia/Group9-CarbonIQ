// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch dashboard stats
export const getDashboardStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Fetch emissions trend
export const getEmissionsTrend = async (userId, days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/emissions-trend/${userId}?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch emissions trend');
    return await response.json();
  } catch (error) {
    console.error('Error fetching emissions trend:', error);
    throw error;
  }
};

// Fetch top emitters
export const getTopEmitters = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/top-emitters/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch top emitters');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top emitters:', error);
    throw error;
  }
};

// Fetch recent activities
export const getRecentActivities = async (userId, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-activities/${userId}?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch activities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

// Fetch assets
export const getAssets = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch assets');
    return await response.json();
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};