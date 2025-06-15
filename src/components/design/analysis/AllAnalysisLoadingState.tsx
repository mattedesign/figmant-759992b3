
import React from 'react';

export const AllAnalysisLoadingState: React.FC = () => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};
