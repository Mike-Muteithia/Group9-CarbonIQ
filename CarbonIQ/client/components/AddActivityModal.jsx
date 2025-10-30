import React, { useState, useEffect } from 'react';

const ACTIVITY_CATEGORIES = {
  transport: {
    name: 'Transportation',
    icon: '🚗',
    types: [
      { value: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
      { value: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
      { value: 'car_electric', label: 'Car (Electric)', unit: 'km' },
      { value: 'car_hybrid', label: 'Car (Hybrid)', unit: 'km' },
      { value: 'motorcycle', label: 'Motorcycle', unit: 'km' },
      { value: 'bus', label: 'Bus', unit: 'km' },
      { value: 'train', label: 'Train', unit: 'km' },
      { value: 'plane_short', label: 'Flight (Short-haul)', unit: 'km' },
      { value: 'plane_long', label: 'Flight (Long-haul)', unit: 'km' },
      { value: 'bicycle', label: 'Bicycle', unit: 'km' },
      { value: 'walking', label: 'Walking', unit: 'km' },
    ]
  },
  energy: {
    name: 'Energy',
    icon: '⚡',
    types: [
      { value: 'electricity_grid', label: 'Electricity (Grid)', unit: 'kWh' },
      { value: 'electricity_coal', label: 'Electricity (Coal)', unit: 'kWh' },
      { value: 'electricity_gas', label: 'Electricity (Gas)', unit: 'kWh' },
      { value: 'electricity_renewable', label: 'Electricity (Renewable)', unit: 'kWh' },
      { value: 'natural_gas', label: 'Natural Gas', unit: 'kWh' },
      { value: 'heating_oil', label: 'Heating Oil', unit: 'L' },
    ]
  },
  food: {
    name: 'Food',
    icon: '🍽️',
    types: [
      { value: 'beef', label: 'Beef', unit: 'kg' },
      { value: 'lamb', label: 'Lamb', unit: 'kg' },
      { value: 'pork', label: 'Pork', unit: 'kg' },
      { value: 'chicken', label: 'Chicken', unit: 'kg' },
      { value: 'fish', label: 'Fish', unit: 'kg' },
      { value: 'eggs', label: 'Eggs', unit: 'kg' },
      { value: 'cheese', label: 'Cheese', unit: 'kg' },
      { value: 'milk', label: 'Milk', unit: 'L' },
      { value: 'rice', label: 'Rice', unit: 'kg' },
      { value: 'vegetables', label: 'Vegetables', unit: 'kg' },
      { value: 'fruits', label: 'Fruits', unit: 'kg' },
    ]
  },
  waste: {
    name: 'Waste',
    icon: '🗑️',
    types: [
      { value: 'general_waste', label: 'General Waste', unit: 'kg' },
      { value: 'recycling', label: 'Recycling', unit: 'kg' },
      { value: 'compost', label: 'Compost', unit: 'kg' },
    ]
  }
};

export default function AddActivityModal({ onClose, onSubmit, activity = null }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'transport',
    activity_type: 'car_petrol',
    value: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [currentUnit, setCurrentUnit] = useState('km');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form if editing an activity
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        category: activity.badge || 'transport',
        activity_type: 'car_petrol', // Default, as we don't store this
        value: activity.amount || '',
        location: activity.location || '',
        date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [activity]);

  // Update unit when category or type changes
  useEffect(() => {
    const category = ACTIVITY_CATEGORIES[formData.category];
    if (category) {
      const type = category.types.find(t => t.value === formData.activity_type);
      if (type) {
        setCurrentUnit(type.unit);
      }
    }
  }, [formData.category, formData.activity_type]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const firstType = ACTIVITY_CATEGORIES[newCategory].types[0];
    
    setFormData({
      ...formData,
      category: newCategory,
      activity_type: firstType.value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      alert('Please enter a valid value');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting activity:', error);
      alert('Failed to save activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategory = ACTIVITY_CATEGORIES[formData.category];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning commute to work"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange({ target: { value: key } })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.category === key
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {currentCategory.types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ({currentUnit}) *
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder={`Enter value in ${currentUnit}`}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              The carbon emission will be calculated automatically
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Home to Office"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : activity ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
