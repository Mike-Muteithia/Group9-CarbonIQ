import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../services/api';

function MetricsCard({ userId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`📊 Fetching metrics for user ${userId}`);
        
        // USE THE IMPORTED API SERVICE INSTEAD OF DIRECT FETCH
        const data = await getDashboardMetrics(userId);
        console.log('✅ Metrics data received:', data);

        if (data.success && data.enhancedData) {
          setMetrics(data.enhancedData);
        } else {
          throw new Error(data.error || 'Invalid data format from server');
        }

      } catch (error) {
        console.error('❌ Error fetching metrics:', error);
        setError(error.message);
        
        // Fallback: create mock data for development
        setMetrics({
          period: "This Month",
          change_type: 'decrease',
          change_percent: 12,
          message: 'Emissions reduced by 12%',
          total_emissions: 845.2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="mx-4 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Error state - but show fallback data if available
  if (error && !metrics) {
    return (
      <div className="mx-4 mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        <p className="text-xs text-red-600 mb-1 font-medium">Error Loading Data</p>
        <p className="text-sm text-red-600 font-semibold">Cannot load metrics</p>
        <p className="text-xs text-red-700">{error}</p>
        <p className="text-xs text-gray-600 mt-2">
          Check if backend is running on port 5000
        </p>
      </div>
    );
  }

  // Use metrics data (could be real or fallback)
  const isPositive = metrics?.change_type === 'increase';
  const isNegative = metrics?.change_type === 'decrease';
  const isNeutral = !isPositive && !isNegative;

  const bgColor = isPositive ? 'bg-green-80' : isNegative ? 'bg-red-50' : 'bg-blue-50';
  const borderColor = isPositive ? 'border-green-100' : isNegative ? 'border-red-100' : 'border-blue-100';
  const textColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-blue-600';
  const messageColor = isPositive ? 'text-green-700' : isNegative ? 'text-red-700' : 'text-blue-700';
  const sign = isPositive ? '+' : isNegative ? '-' : '';

  return (
    <div className={`mx-4 mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3 ${bgColor} ${borderColor}`}>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-600">{metrics?.period || 'This Month'}</span>
        <span className={`text-base font-semibold ${textColor}`}>
          {sign}{Math.abs(metrics?.change_percent || 0)}%
        </span>
      </div>
      
      <p className={`text-sm ${messageColor}`}>
        {metrics?.message || 'No data available'}
      </p>
      
      {/* Optional: Show total emissions if available */}
      {/* {metrics?.total_emissions && (
        <p className="text-xs text-gray-500 mt-1">
          Total: {metrics.total_emissions} kg CO₂
        </p> */}
      {/* )} */}
    </div>
  );
}

export default MetricsCard;