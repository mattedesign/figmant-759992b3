
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PanelRightClose } from 'lucide-react';

interface AnalysisNavigationHeaderProps {
  onToggleCollapse?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({
  onToggleCollapse,
  activeTab = 'details',
  onTabChange
}) => {
  return (
    <div className="flex-none border-b border-border">
      {/* Header with title and collapse button */}
      <div className="p-4 pb-2 flex items-center justify-between">
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

      {/* Tabs */}
      <div className="px-4 pb-3">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-sm">
              Suggestions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
