import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddAssetForm = ({ asset, onSubmit, onClose }) => {
  const [assetData, setAssetData] = useState({
    name: '',
    type: 'vehicle',
    fuel_type: 'gasoline',
    model: '',
    year: new Date().getFullYear().toString(),
    emoji: '🚗',
    carbon_impact: 0
  });

  // Load existing asset data if editing
  useEffect(() => {
    if (asset) {
      setAssetData({
        name: asset.name || '',
        type: asset.type || 'vehicle',
        fuel_type: asset.fuel_type || 'gasoline',
        model: asset.model || '',
        year: asset.year || new Date().getFullYear().toString(),
        emoji: asset.emoji || '🚗',
        carbon_impact: asset.carbon_impact || 0
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData({ ...assetData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assetData);
  };

  const handleCancel = () => {
    onClose();
  };

  // Emoji options based on type
  const getEmojiOptions = (type) => {
    const emojiMap = {
      vehicle: ['🚗', '🚙', '🚚', '🚐', '🏎️'],
      machine: ['🏗️', '⚡', '🔧', '⚙️', '🛠️'],
      aircraft: ['✈️', '🛩️', '🚁', '🛫']
    };
    return emojiMap[type] || ['📝'];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Asset Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., My Tesla Model 3"
                value={assetData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type and Fuel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={assetData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="vehicle">Vehicle</option>
                  <option value="aircraft">Aircraft</option>
                  <option value="machine">Machine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Fuel Type *
                </label>
                <select
                  name="fuel_type"
                  value={assetData.fuel_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Model and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Make & Model
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g., Tesla Model 3"
                  value={assetData.model}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  placeholder="e.g., 2023"
                  value={assetData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  maxLength="4"
                />
              </div>
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Icon
              </label>
              <div className="flex gap-2">
                {getEmojiOptions(assetData.type).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAssetData({ ...assetData, emoji })}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition ${
                      assetData.emoji === emoji
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              {asset ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetForm;