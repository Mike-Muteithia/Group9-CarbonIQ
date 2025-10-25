import React, { useState } from 'react';

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
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-semibold mb-6">Add New Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name *</label>
            <input
              type="text"
              name="assetName"
              placeholder="e.g., My Tesla Model 3"
              value={assetData.assetName}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select
              name="type"
              value={assetData.type}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            >
              <option>Vehicle</option>
              <option>Aircraft</option>
              <option>Machine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g., Electric Car, Diesel Truck"
              value={assetData.category}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
            <select
              name="fuelType"
              value={assetData.fuelType}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            >
              <option>Gasoline</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Make & Model</label>
            <input
              type="text"
              name="makeModel"
              placeholder="e.g., Tesla Model 3"
              value={assetData.makeModel}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={assetData.year}
              onChange={handleChange}
              className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            placeholder="Additional details about this asset..."
            value={assetData.notes}
            onChange={handleChange}
            className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
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
