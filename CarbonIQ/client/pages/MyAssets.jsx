import React, { useState } from 'react';
import AddAssetForm from '../components/AddAssetForm';
import Image16 from "../assets/Image16.png";
import movingImage from "../assets/moving.png";

export default function MyAssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const assets = [
    { id: 1, name: 'Excavator X300', type: 'machine', fuelType: 'diesel', model: 'CAT 320', year: '2019', emoji: '🏗️' },
    { id: 2, name: 'Work Truck', type: 'vehicle', fuelType: 'diesel', model: 'Toyota Hilux', year: '2020', emoji: '🚚' },
    { id: 3, name: 'My Tesla Model 3', type: 'vehicle', fuelType: 'electric', model: 'Tesla Model 3', year: '2023', emoji: '🚗' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assets</h1>
            <p className="text-gray-500 text-sm">Manage your vehicles, aircraft, and machines</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition shadow-sm"
          >
            <span className="text-lg font-bold">+</span>
            <span>Add Asset</span>
          </button>
        </div>

        <div className="flex gap-5 mb-8 flex-wrap">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-[280px]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                  {asset.emoji}
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-red-50 rounded">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">{asset.name}</h3>
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">{asset.type}</span>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded ${asset.fuelType === 'diesel' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{asset.fuelType}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>{asset.model}</p>
                <p>Year: {asset.year}</p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && <AddAssetForm onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}
