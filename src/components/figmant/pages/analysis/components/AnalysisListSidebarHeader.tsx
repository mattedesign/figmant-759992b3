
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface AnalysisListSidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AnalysisListSidebarHeader: React.FC<AnalysisListSidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="p-4 pb-2 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        {!isCollapsed && <h3 className="font-semibold text-gray-900 pl-3">History</h3>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
