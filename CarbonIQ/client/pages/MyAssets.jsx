import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAssetForm from '../components/AddAssetForm';
import { assetsAPI } from '../services/api';

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Get user ID from localStorage (authenticated user)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch assets from backend
  const fetchAssets = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const assetsData = await assetsAPI.getAssets(userId);
      setAssets(assetsData);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load assets on component mount
  useEffect(() => {
    fetchAssets();
  }, [userId]);

  // Handle create asset
  const handleCreateAsset = async (assetData) => {
    try {
      await assetsAPI.createAsset({
        ...assetData,
        user_id: userId
      });
      await fetchAssets(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset. Please try again.');
    }
  };

  // Handle update asset
  const handleUpdateAsset = async (assetData) => {
    try {
      await assetsAPI.updateAsset(editingAsset.id, assetData);
      await fetchAssets(); // Refresh the list
      setEditingAsset(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating asset:', err);
      setError('Failed to update asset. Please try again.');
    }
  };

  // Handle delete asset
  const handleDeleteAsset = async (assetId, assetName) => {
    if (!window.confirm(`Are you sure you want to delete "${assetName}"?`)) {
      return;
    }

    try {
      await assetsAPI.deleteAsset(assetId);
      await fetchAssets(); // Refresh the list
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset. Please try again.');
    }
  };

  // Handle edit click
  const handleEditClick = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  // Handle form submit
  const handleFormSubmit = (assetData) => {
    if (editingAsset) {
      handleUpdateAsset(assetData);
    } else {
      handleCreateAsset(assetData);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assets</h1>
              <p className="text-gray-500 text-sm">Manage your vehicles, aircraft, and machines</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assets</h1>
            <p className="text-gray-500 text-sm">Manage your vehicles, aircraft, and machines</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition hover:scale-105 transition-transform duration-300 shadow-sm"
          >
            <span className="text-lg font-bold">+</span>
            <span>Add Asset</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Assets Grid */}
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏗️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first asset</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition hover:scale-105 transition-transform duration-300"
            >
              Add Your First Asset
            </button>
          </div>
        ) : (
          <div className="flex gap-5 mb-8 flex-wrap">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-[280px] hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                    {asset.emoji || '📝'}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditClick(asset)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit asset"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteAsset(asset.id, asset.name)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete asset"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">{asset.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">{asset.type}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded ${
                    asset.fuel_type === 'electric' 
                      ? 'bg-green-100 text-green-700' 
                      : asset.fuel_type === 'diesel'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {asset.fuel_type || 'No fuel type'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{asset.model}</p>
                  <p>Year: {asset.year}</p>
                  {asset.carbon_impact > 0 && (
                    <p>Carbon Impact: {asset.carbon_impact} kg CO₂</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Asset Modal */}
        {isModalOpen && (
          <AddAssetForm 
            asset={editingAsset}
            onSubmit={handleFormSubmit}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
}