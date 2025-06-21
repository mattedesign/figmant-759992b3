
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AnalysisRightPanelHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalAttachments: number;
}

export const AnalysisRightPanelHeader: React.FC<AnalysisRightPanelHeaderProps> = ({
  activeTab,
  onTabChange,
  totalAttachments
}) => {
  return (
    <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: '#FFF' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Analysis Details</h3>
        <Badge variant="secondary" className="text-xs">
          {totalAttachments}
        </Badge>
      </div>
      
      {/* Tabs positioned in header where they belong */}
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="text-sm">
            Details
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="text-sm">
            Insights
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
