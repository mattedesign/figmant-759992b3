
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose } from 'lucide-react';

interface AnalysisNavigationHeaderProps {
  onToggleCollapse?: () => void;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({
  onToggleCollapse
}) => {
  return (
    <div className="flex-none border-b border-border">
      {/* Header with collapse button on left and title */}
      <div className="p-4 flex items-center gap-3">
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted flex-shrink-0"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold">Analysis Assets</h2>
      </div>
    </div>
  );
};
