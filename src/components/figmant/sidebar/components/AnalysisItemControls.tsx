
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface AnalysisItemControlsProps {
  isExpanded: boolean;
  onToggleExpanded: (event: React.MouseEvent) => void;
  onAnalysisClick: (event: React.MouseEvent) => void;
  analysisType: string;
}

export const AnalysisItemControls: React.FC<AnalysisItemControlsProps> = ({
  isExpanded,
  onToggleExpanded,
  onAnalysisClick,
  analysisType
}) => {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={onAnalysisClick}
        className="h-6 w-6 p-0"
        title={analysisType === 'chat' ? 'Continue in Chat' : 'Open in Wizard'}
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpanded}
        className="h-6 w-6 p-0"
      >
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
