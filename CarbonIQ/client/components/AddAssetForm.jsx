import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddAssetForm = () => {
  const [assetData, setAssetData] = useState({
    assetName: '',
    type: 'Vehicle',
    category: '',
    fuelType: 'Gasoline',
    makeModel: '',
    year: new Date().getFullYear(),
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({ ...assetData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Asset created:', assetData);
  };

  const handleCancel = () => {
    setAssetData({
      assetName: '',
      type: 'Vehicle',
      category: '',
      fuelType: 'Gasoline',
      makeModel: '',
      year: new Date().getFullYear(),
      notes: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white border border-gray-200 shadow rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-bold mb-2">Add New Asset</h2>
      <div className="h-px bg-gray-200 mb-8"></div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800">Asset Name *</label>
            <input
              type="text"
              name="assetName"
              placeholder="e.g., My Tesla Model 3"
              value={assetData.assetName}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Type *</label>
            <select
              name="type"
              value={assetData.type}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option>Vehicle</option>
              <option>Aircraft</option>
              <option>Machine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g., Electric Car, Diesel Truck"
              value={assetData.category}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Fuel Type *</label>
            <select
              name="fuelType"
              value={assetData.fuelType}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option>Gasoline</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Make & Model</label>
            <input
              type="text"
              name="makeModel"
              placeholder="e.g., Tesla Model 3"
              value={assetData.makeModel}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">Year</label>
            <input
              type="number"
              name="year"
              value={assetData.year}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">Notes</label>
          <textarea
            name="notes"
            placeholder="Additional details about this activity..."
            value={assetData.notes}
            onChange={handleChange}
            className="mt-2 w-full border border-gray-300 bg-gray-50 rounded-md p-3 h-24 focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Asset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetForm;
