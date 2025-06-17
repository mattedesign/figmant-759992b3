
import React from 'react';
import { Logo } from '@/components/common/Logo';

export const AnalysisChatPlaceholder: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center py-12 px-8 max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo 
            size="md" 
            variant="collapsed"
            className="w-6 h-6"
          />
          <h2 className="text-xl font-semibold text-gray-900">Design Analysis</h2>
        </div>
        <p className="text-gray-600 mx-auto text-xs">
          Upload files or start typing to begin your design analysis. Use the input below to get started.
        </p>
      </div>
    </div>
  );
};
