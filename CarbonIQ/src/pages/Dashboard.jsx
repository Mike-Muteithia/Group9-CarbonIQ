import React from 'react';

export default function CarbonIQDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to CarbonIQ
          </h1>
          <p className="text-gray-600">
            Track your carbon footprint and take action for the sustainable future
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className="flex gap-6 mb-8 overflow-x-auto">
          {/* Total Emission Card */}
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

          {/* This Month Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full">
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

          {/* Activities Logged Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full">
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

          {/* Active Goals Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full">
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
      </div>
    </div>
  );
}