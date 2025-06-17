
import React from 'react';

export const AnalysisChatPlaceholder: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center py-12 px-8 max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/branding/image/2025-06-17/gco7fnt62_title.svg"
            alt="Design Analysis"
            className="h-8"
          />
        </div>
        <p className="text-gray-600 mx-auto text-xs">
          Upload files or start typing to begin your design analysis. Use the input below to get started.
        </p>
      </div>
    </div>
  );
};
