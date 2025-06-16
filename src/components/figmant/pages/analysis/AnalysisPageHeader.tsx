
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
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      <p className="text-base text-gray-600 mt-2">
        {description}
      </p>
    </div>
  );
};
