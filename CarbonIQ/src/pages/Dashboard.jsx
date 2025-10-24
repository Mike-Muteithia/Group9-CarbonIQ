import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function CarbonIQDashboard() {
 
  const emissionsData = [
    { date: 'Dec 19', value: 0 },
    { date: 'Jan 26', value: 1 },
    { date: 'Sep 27', value: 2 },
    { date: 'Aug 29', value: 3 },
    { date: 'Jun 30', value: 2 },
    { date: 'Aug 31', value: 2.5 },
    { date: 'Sep 30', value: 3 },
    { date: 'Oct 02', value: 2 },
    { date: 'Oct 08', value: 1 },
  ];

  
  const topEmittersData = [
    { name: 'Air Travel Model-Y', value: 35, color: '#f59e0b' },
    { name: 'Refrigerator X200', value: 30, color: '#10b981' },
    { name: 'Vehicle Model-A', value: 20, color: '#3b82f6' },
    { name: 'Work Truck Z30', value: 15, color: '#8b5cf6' },
  ];

  
  const recentActivities = [
    {
      title: 'My Tesla Model 3',
      date: 'Dec 20, 2024',
      location: '3 times to Downtown',
      amount: '14.20',
      unit: 'kg CO₂',
      badge: 'vehicle',
      icon: '🚗'
    },
    {
      title: 'Work Truck',
      date: 'Dec 19, 2024',
      location: 'Office to Industrial Park',
      amount: '22.78',
      unit: 'kg CO₂',
      badge: 'vehicle',
      icon: '🚚'
    },
    {
      title: 'My Tesla Model 3',
      date: 'Dec 18, 2024',
      location: 'City to Beach',
      amount: '30.40',
      unit: 'kg CO₂',
      badge: 'vehicle',
      icon: '🚗'
    },
    {
      title: 'Excavator X300',
      date: 'Dec 16, 2024',
      location: 'Construction Site A',
      amount: '32.16',
      unit: 'kg CO₂',
      badge: 'machine',
      icon: '🏗️'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CarbonIQ
          </h1>
          <p className="text-gray-600">
            Track your carbon footprint and take action for the sustainable future
          </p>
        </div>

        <div className="flex gap-6 mb-8 overflow-x-auto">
          

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 min-w-[240px] flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Emission</p>
                <p className="text-3xl font-bold text-gray-900">100.54 kg</p>
                <p className="text-xs text-red-500 mt-1">+0.5kg 11.5%</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
          </div>

        
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 min-w-[240px] flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">0.00 kg</p>
                <p className="text-xs text-gray-500 mt-1">-0% vs last month</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 min-w-[240px] flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activities Logged</p>
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500 mt-1">In this month</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 min-w-[240px] flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500 mt-1">Reduction targets</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mb-8">
         
          <div className="flex-[2] bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Emissions Trend (Last 30 Days)
            </h2>
            <div className="h-80">
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
                    label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
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
            </div>
          </div>

          
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Top Emitters
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topEmittersData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {topEmittersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3 px-2">
              {topEmittersData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                    {activity.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {activity.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>📅 {activity.date}</span>
                      <span>•</span>
                      <span>📍 {activity.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}