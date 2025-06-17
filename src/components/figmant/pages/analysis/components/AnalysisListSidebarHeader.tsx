
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
      <div className="flex items-center justify-between">
        {!isCollapsed && <h3 className="font-semibold text-gray-900">History</h3>}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            title="New Analysis"
          >
            <Plus className="h-4 w-4" />
          </Button>
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
    </div>
  );
};
