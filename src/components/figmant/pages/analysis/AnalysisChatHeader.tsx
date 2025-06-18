
import React from 'react';

interface AnalysisChatHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AnalysisChatHeader: React.FC<AnalysisChatHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Analysis Tools</h2>
        <p className="text-sm text-gray-600">Choose your analysis approach</p>
      </div>
    </div>
  );
};
