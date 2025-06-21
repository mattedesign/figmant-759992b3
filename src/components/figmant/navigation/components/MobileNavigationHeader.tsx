
import React from 'react';

export const MobileNavigationHeader: React.FC = () => {
  return (
    <div className="p-5 border-b border-gray-200 safe-top bg-white">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">figmant</h1>
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Mobile
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">UX Analysis Platform</p>
    </div>
  );
};
