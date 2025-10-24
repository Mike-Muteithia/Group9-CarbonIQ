import React from 'react';

export default function MyAssets() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex items-center justify-between mb-8">
         
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Assets
            </h1>
            <p className="text-gray-600">
              Manage your vehicles, aircraft, and machines
            </p>
          </div>
          
         
          <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">
            <span className="text-xl">+</span>
            <span>Add Asset</span>
          </button>
        </div>
      </div>
    </div>
  );
}