
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useSimplifiedAnalysisData } from '@/hooks/useSimplifiedAnalysisData';
import { FigmantAnalysisCard } from './components/FigmantAnalysisCard';

interface FigmantMiddlePanelProps {
  activeSection: string;
  onAnalysisSelect: (analysis: any) => void;
  selectedAnalysis: any;
}

export const FigmantMiddlePanel: React.FC<FigmantMiddlePanelProps> = ({
  activeSection,
  onAnalysisSelect,
  selectedAnalysis
}) => {
  const { allAnalyses, isLoading } = useSimplifiedAnalysisData();

  const renderContent = () => {
    switch (activeSection) {
      case 'design-analysis':
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Design Analysis</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search analyses..." 
                  className="pl-9"
                />
              </div>
            </div>

            {/* Analysis List */}
            <ScrollArea className="flex-1">
              <div className="px-4 space-y-2">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading analyses...
                  </div>
                ) : allAnalyses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No analyses found
                  </div>
                ) : (
                  allAnalyses.map((analysis) => (
                    <FigmantAnalysisCard
                      key={analysis.id}
                      analysis={analysis}
                      isSelected={selectedAnalysis?.id === analysis.id}
                      onClick={() => onAnalysisSelect(analysis)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        );

      case 'dashboard':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Recent Activity</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {allAnalyses.length} analyses completed
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Quick Actions</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Upload new design
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Analytics</h2>
            <div className="text-sm text-muted-foreground">
              Analytics overview coming soon...
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="text-sm text-muted-foreground">
              Settings panel coming soon...
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4">
            <div className="text-sm text-muted-foreground">
              Select a section from the sidebar
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {renderContent()}
    </div>
  );
};
