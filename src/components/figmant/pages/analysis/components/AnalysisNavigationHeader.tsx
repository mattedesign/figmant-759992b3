
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose } from 'lucide-react';
import { MainCreditDisplay } from './MainCreditDisplay';

interface AnalysisNavigationHeaderProps {
  onToggleCollapse?: () => void;
  creditCost?: number;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({
  onToggleCollapse,
  creditCost = 1
}) => {
  return (
    <div className="flex-none border-b border-border">
      {/* Header with collapse button on left and credit cost display on right */}
      <div className="p-4 flex items-center justify-between">
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
        
        <MainCreditDisplay />
      </div>
    </div>
  );
};
