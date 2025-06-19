
import React from 'react';

interface RecentAnalysesEmptyStateProps {
  isLoading: boolean;
}

export const RecentAnalysesEmptyState: React.FC<RecentAnalysesEmptyStateProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-500">
        <div className="text-sm">Loading analyses...</div>
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-gray-500">
      <div className="h-8 w-8 mx-auto mb-2 opacity-50 bg-gray-200 rounded"></div>
      <p className="text-sm">No recent analyses</p>
    </div>
  );
};
