import { useState, useEffect } from 'react';

function MetricsCard({ userId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TEMPORARY FIX - Replace your current useEffect with this one
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log('📊 Fetching dashboard stats for metrics');
        const response = await fetch(`/api/dashboard/stats/${userId}`);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('📈 Dashboard stats:', data);
        
        // Use the enhancedData from dashboard stats
        if (data.enhancedData) {
          setMetrics(data.enhancedData);
        } else {
          // Fallback: create basic metrics from dashboard data
          setMetrics({
            period: "This Month",
            change_type: 'neutral',
            change_percent: 0,
            message: 'Using dashboard data',
            total_emissions: data.thisMonth || 0
          });
        }
        
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMetrics();
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

  // Error state
  if (error) {
    return (
      <div className="mx-4 mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        <p className="text-xs text-red-600 mb-1 font-medium">Error Loading Data</p>
        <p className="text-sm text-red-600 font-semibold">Cannot load metrics</p>
        <p className="text-xs text-red-700">{error}</p>
      </div>
    );
  }

  // No data state
  if (!metrics) {
    return (
      <div className="mx-4 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
        <p className="text-xs text-gray-600 mb-1 font-medium">This Month</p>
        <p className="text-sm text-gray-600 font-semibold">No data available</p>
        <p className="text-xs text-gray-700">Start recording emissions to see monthly progress</p>
      </div>
    );
  }

  // Determine styles based on change type
  const isPositive = metrics.change_type === 'increase';
  const isNegative = metrics.change_type === 'decrease';
  const isNeutral = !isPositive && !isNegative;

  const bgColor = isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-blue-50';
  const borderColor = isPositive ? 'border-green-100' : isNegative ? 'border-red-100' : 'border-blue-100';
  const textColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-blue-600';
  const messageColor = isPositive ? 'text-green-700' : isNegative ? 'text-red-700' : 'text-blue-700';
  const sign = isPositive ? '+' : isNegative ? '-' : '';

  return (
    <div className={`mx-4 mb-4 ${bgColor} border ${borderColor} rounded-lg px-4 py-3`}>
      <div className="flex justify-between items-start mb-1">
        <p className="text-xs text-gray-600 font-medium">
          {metrics.period || 'This Month'}
        </p>
        <span className="text-xs">
          {isPositive ? '📈' : isNegative ? '📉' : '➡️'}
        </span>
      </div>
      
      <p className={`text-sm ${textColor} font-semibold mb-1`}>
        {sign}{Math.abs(metrics.change_percent)}%
      </p>
      
      <p className={`text-xs ${messageColor}`}>
        {metrics.message}
      </p>
      
      {/* Show total emissions if available */}
      {metrics.total_emissions && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Total: {metrics.total_emissions} kg CO₂
          </p>
        </div>
      )}
    </div>
  );
}

export default MetricsCard;