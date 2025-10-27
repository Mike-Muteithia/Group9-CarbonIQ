import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import leafImage from "../assets/leaf.png";
import movingImage from "../assets/moving.png";
import vitalImage from "../assets/vital.png";
import targetImage from "../assets/target.png";
import { getDashboardStats, getEmissionsTrend, getTopEmitters, getRecentActivities } from '../services/api';

export default function CarbonIQDashboard() {
  // State for all dashboard data
  const [stats, setStats] = useState({
    totalEmission: 0,
    thisMonth: 0,
    activitiesLogged: 0,
    activeGoals: 0
  });
  const [emissionsData, setEmissionsData] = useState([]);
  const [topEmittersData, setTopEmittersData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User ID (you can get this from auth context later)
  const userId = 1;

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Starting to fetch dashboard data...');
        
        // Fetch all data in parallel with better error handling
        const [statsData, trendData, emittersData, activitiesData] = await Promise.all([
          getDashboardStats(userId).catch(err => {
            console.error('Error fetching stats:', err);
            return { totalEmission: 0, thisMonth: 0, activitiesLogged: 0, activeGoals: 0 };
          }),
          getEmissionsTrend(userId).catch(err => {
            console.error('Error fetching trend:', err);
            return [];
          }),
          getTopEmitters(userId).catch(err => {
            console.error('Error fetching emitters:', err);
            return [];
          }),
          getRecentActivities(userId).catch(err => {
            console.error('Error fetching activities:', err);
            return [];
          })
        ]);

        console.log('📊 Data loaded:', {
          stats: statsData,
          trend: trendData,
          emitters: emittersData,
          activities: activitiesData
        });

        // Update state
        setStats(statsData);
        setEmissionsData(trendData || []);
        setTopEmittersData(emittersData || []);
        setRecentActivities(activitiesData || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CarbonIQ
          </h1>
          <p className="text-gray-600">
            Track your carbon footprint and take action for the sustainable future
          </p>
        </div>

        {/* Stats Cards - Now using real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Emission</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmission || 0} kg</p>
                <p className="text-xs text-gray-500 mt-1">CO₂ equivalent</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <img src={leafImage} alt="Leaf" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.thisMonth || 0} kg</p>
                <p className="text-xs text-gray-500 mt-1">Monthly emissions</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <img src={movingImage} alt="Moving" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activities Logged</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activitiesLogged || 0}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <img src={vitalImage} alt="Vital" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeGoals || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Reduction targets</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <img src={targetImage} alt="Target" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Emissions Trend Chart */}
          <div className="flex-[2] bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Emissions Trend (Last 30 Days)
            </h2>
            <div className="h-80">
              {emissionsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emissionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }} 
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px' 
                      }} 
                      formatter={(value) => [`${value} kg`, 'Emissions']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ fill: '#10b981', r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No emissions data available for the selected period
                </div>
              )}
            </div>
          </div>

          {/* Top Emitters Pie Chart */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Emitters</h2>
            {topEmittersData.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="w-48 h-48 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={topEmittersData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        dataKey="value" 
                        strokeWidth={0}
                        label={({ name, value }) => `${name}: ${value}kg`}
                      >
                        {topEmittersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, 'Emissions']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {topEmittersData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-sm flex-shrink-0" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-gray-700 text-sm">
                        {item.name}: {item.value}kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                No emitter data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:scale-105 transition-transform duration-300">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 ${activity.iconBg || 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-xl flex-shrink-0`}>
                      {activity.icon || '📝'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {activity.badge || 'activity'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                          </svg>
                          <span>{activity.date || 'Unknown date'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          <span>{activity.location || 'No location'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-green-600">{activity.amount || '0'}</p>
                    <p className="text-xs text-gray-500">{activity.unit || 'kg CO₂'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activities found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}