import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CarbonIQDashboard() {
  // Emissions trend data
  const emissionsData = [
    { date: 'Jan 19', value: 0 },
    { date: 'Feb 26', value: 1 },
    { date: 'Mar 27', value: 2 },
    { date: 'Apr 29', value: 3 },
    { date: 'May 30', value: 2 },
    { date: 'Jun 31', value: 2.5 },
    { date: 'Jul 30', value: 3 },
    { date: 'Aug 02', value: 2 },
    { date: 'Sep 08', value: 1 },
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

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Emissions Trend (Last 30 Days)
          </h2>
          <div className="h-64">
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
      </div>
    </div>
  );
}