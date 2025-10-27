// services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Enhanced response handler
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is HTML (error page) instead of JSON
  if (contentType && contentType.includes('text/html')) {
    const errorText = await response.text();
    console.error(' Server returned HTML error page:', errorText.substring(0, 200));
    throw new Error(`Server error (${response.status}) - Check backend logs`);
  }
  
  if (!response.ok) {
    // Try to parse JSON error if available
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Request failed (${response.status})`);
    }
    throw new Error(`Request failed with status ${response.status}`);
  }
  
  // Parse successful JSON response
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  throw new Error('Response is not JSON');
};

// Fetch dashboard stats
export const getDashboardStats = async (userId) => {
  try {
    console.log(` Fetching dashboard stats for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/${userId}`);
    const data = await handleResponse(response);
    console.log(' Dashboard stats loaded');
    return data;
  } catch (error) {
    console.error(' Error fetching dashboard stats:', error.message);
    throw new Error(`Failed to load dashboard: ${error.message}`);
  }
};

// Fetch emissions trend
export const getEmissionsTrend = async (userId, days = 30) => {
  try {
    console.log(` Fetching emissions trend for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/dashboard/emissions-trend/${userId}?days=${days}`);
    const data = await handleResponse(response);
    console.log(' Emissions trend loaded');
    return data;
  } catch (error) {
    console.error(' Error fetching emissions trend:', error.message);
    throw new Error(`Failed to load emissions trend: ${error.message}`);
  }
};

// Fetch top emitters
export const getTopEmitters = async (userId) => {
  try {
    console.log(` Fetching top emitters for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/dashboard/top-emitters/${userId}`);
    const data = await handleResponse(response);
    console.log(' Top emitters loaded');
    return data;
  } catch (error) {
    console.error(' Error fetching top emitters:', error.message);
    throw new Error(`Failed to load top emitters: ${error.message}`);
  }
};

// Fetch recent activities
export const getRecentActivities = async (userId, limit = 10) => {
  try {
    console.log(` Fetching recent activities for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-activities/${userId}?limit=${limit}`);
    const data = await handleResponse(response);
    console.log(' Recent activities loaded');
    return data;
  } catch (error) {
    console.error(' Error fetching recent activities:', error.message);
    throw new Error(`Failed to load recent activities: ${error.message}`);
  }
};

// Fetch assets
export const getAssets = async (userId) => {
  try {
    console.log(`🔄 Fetching assets for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/assets/${userId}`);
    const data = await handleResponse(response);
    console.log(' Assets loaded');
    return data;
  } catch (error) {
    console.error(' Error fetching assets:', error.message);
    throw new Error(`Failed to load assets: ${error.message}`);
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log(' Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/test-db`);
    const data = await handleResponse(response);
    console.log(' API connection successful');
    return data;
  } catch (error) {
    console.error(' API connection failed:', error.message);
    throw new Error(`Cannot connect to backend: ${error.message}`);
  }
};

// Seed sample data
export const seedSampleData = async (userId) => {
  try {
    console.log(` Seeding sample data for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/seed-data/${userId}`, {
      method: 'POST',
    });
    const data = await handleResponse(response);
    console.log(' Sample data seeded');
    return data;
  } catch (error) {
    console.error(' Error seeding sample data:', error.message);
    throw new Error(`Failed to seed data: ${error.message}`);
  }
};

// Seed emission data
export const seedEmissionData = async (userId) => {
  try {
    console.log(` Seeding emission data for user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/seed-emissions/${userId}`, {
      method: 'POST',
    });
    const data = await handleResponse(response);
    console.log(' Emission data seeded');
    return data;
  } catch (error) {
    console.error(' Error seeding emission data:', error.message);
    throw new Error(`Failed to seed emissions: ${error.message}`);
  }
};