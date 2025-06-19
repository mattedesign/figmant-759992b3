
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
    <div className="flex-none p-4 border-b border-border flex items-center justify-between">
      <h2 className="text-lg font-semibold">Analysis Assets</h2>
      {onToggleCollapse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
