
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
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
