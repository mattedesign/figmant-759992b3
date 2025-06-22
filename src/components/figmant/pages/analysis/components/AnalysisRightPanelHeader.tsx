
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisRightPanelHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalAttachments: number;
  showAnalysisHeader?: boolean; // Keep prop for backward compatibility but don't use it
}

export const AnalysisRightPanelHeader: React.FC<AnalysisRightPanelHeaderProps> = ({
  activeTab,
  onTabChange,
  totalAttachments,
  showAnalysisHeader = false // Keep default but ignore the value
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Remove the persistent analysis header completely - it was blocking navigation */}
      
      {/* Tabs */}
      <div className="p-3">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-xs">
              Details
            </TabsTrigger>
            <TabsTrigger value="attachments" className="text-xs">
              Files ({totalAttachments})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
