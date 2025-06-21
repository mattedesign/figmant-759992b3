
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { AnalysisDetailDrawer } from './AnalysisDetailDrawer';
import { EnhancedHistoryCard } from '../../navigation/components/EnhancedHistoryCard';

interface CollapsibleHistorySidebarProps {
  onNewAnalysis: () => void;
}

export const CollapsibleHistorySidebar: React.FC<CollapsibleHistorySidebarProps> = ({
  onNewAnalysis
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();

  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis' 
    })),
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: 'Chat Analysis' 
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 10);

  const handleAnalysisClick = (analysis: any) => {
    console.log('Opening analysis:', analysis);
    setSelectedAnalysis(analysis);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        <div className="flex-none p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-lg">Analysis History</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex-none p-4 border-b border-gray-200">
          {isCollapsed ? (
            <Button
              onClick={onNewAnalysis}
              className="w-full h-10 p-0"
              title="New Analysis"
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onNewAnalysis}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  Loading analyses...
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  <History className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  No analyses found
                  <p className="text-xs mt-1">Create your first analysis to see it here</p>
                </div>
              ) : (
                recentAnalyses.map((analysis) => (
                  <EnhancedHistoryCard
                    key={`${analysis.type}-${analysis.id}`}
                    analysis={analysis}
                    onViewDetails={handleAnalysisClick}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <AnalysisDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAnalysis(null);
        }}
        analysis={selectedAnalysis}
      />
    </>
  );
};
