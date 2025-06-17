
import React from 'react';
import { Button } from '@/components/ui/button';
import { getTemplateIcon } from './TemplateIcon';

interface CollapsedAnalysisListProps {
  analyses: any[];
  onItemClick: (analysis: any) => void;
}

export const CollapsedAnalysisList: React.FC<CollapsedAnalysisListProps> = ({
  analyses,
  onItemClick
}) => {
  return (
    <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
      {analyses.slice(0, 5).map((analysis) => {
        const TemplateIcon = getTemplateIcon(analysis.analysisType);
        return (
          <Button
            key={`${analysis.type}-${analysis.id}`}
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 flex items-center justify-center"
            onClick={() => onItemClick(analysis)}
            title={analysis.title}
          >
            <TemplateIcon className="h-5 w-5" />
          </Button>
        );
      })}
    </div>
  );
};
