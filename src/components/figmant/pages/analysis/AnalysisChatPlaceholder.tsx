
import React from 'react';
import { Logo } from '@/components/common/Logo';

export const AnalysisChatPlaceholder: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Logo 
            size="md" 
            variant="collapsed"
            className="w-9 h-9"
          />
          <h2 className="text-xl font-semibold text-gray-900">Design Analysis</h2>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload files or start typing to begin your design analysis. Use the input below to get started.
        </p>
      </div>
    </div>
  );
};
