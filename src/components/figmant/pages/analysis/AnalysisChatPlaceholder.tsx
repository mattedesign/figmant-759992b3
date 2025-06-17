
import React from 'react';

export const AnalysisChatPlaceholder: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/c52140a4-1da3-4d65-aa1d-35e9ccd21d91.png" 
            alt="Design Analysis" 
            className="w-12 h-12"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Design Analysis</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload files or start typing to begin your design analysis. Use the input below to get started.
        </p>
      </div>
    </div>
  );
};
