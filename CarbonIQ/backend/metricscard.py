import { useState, useEffect } from 'react';

function MetricsCard({ userId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/dashboard/stats/${userId}`);
        const data = await response.json();
        
        // Use the enhancedData from the API response
        if (data.enhancedData) {
          setMetrics(data.enhancedData);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

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

  if (!metrics) {
    return (
      <div className="mx-4 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
        <p className="text-xs text-gray-600 mb-1 font-medium">This Month</p>
        <p className="text-sm text-gray-600 font-semibold">No data</p>
        <p className="text-xs text-gray-700">Start recording emissions to see progress</p>
      </div>
    );
  }

  // Determine styles based on change type
  const isPositive = metrics.change_type === 'increase';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isPositive ? 'border-green-100' : 'border-red-100';
  const textColor = isPositive ? 'text-green-600' : 'text-red-600';
  const messageColor = isPositive ? 'text-green-700' : 'text-red-700';
  const sign = isPositive ? '+' : '-';

  return (
    <div className={`mx-4 mb-4 ${bgColor} border ${borderColor} rounded-lg px-4 py-3`}>
      <p className="text-xs text-gray-600 mb-1 font-medium">{metrics.period}</p>
      <p className={`text-sm ${textColor} font-semibold`}>
        {sign}{metrics.change_percent}%
      </p>
      <p className={`text-xs ${messageColor}`}>{metrics.message}</p>
    </div>
  );
}

export default MetricsCard;