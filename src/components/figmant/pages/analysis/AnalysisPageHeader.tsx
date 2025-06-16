
import React from 'react';

interface AnalysisPageHeaderProps {
  title?: string;
  description?: string;
}

export const AnalysisPageHeader: React.FC<AnalysisPageHeaderProps> = ({
  title = "Analysis",
  description = "AI-powered design insights"
}) => {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
      <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
};
