
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisNavigationTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AnalysisNavigationTabs: React.FC<AnalysisNavigationTabsProps> = ({
  activeTab = 'details',
  onTabChange
}) => {
  return (
    <div className="px-4 pb-3 border-b border-border">
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
  );
};
