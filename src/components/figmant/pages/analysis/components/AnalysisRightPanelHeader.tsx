
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisRightPanelHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalAttachments: number;
  showAnalysisHeader?: boolean; // New prop to control analysis-specific UI
}

export const AnalysisRightPanelHeader: React.FC<AnalysisRightPanelHeaderProps> = ({
  activeTab,
  onTabChange,
  totalAttachments,
  showAnalysisHeader = false // Default to false
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Analysis-specific header - only show when showAnalysisHeader is true */}
      {showAnalysisHeader && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/figmant')}
              className="flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Figmant
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-600 border-t border-gray-200 pt-2">
            Analysis
          </div>
        </div>
      )}
      
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
