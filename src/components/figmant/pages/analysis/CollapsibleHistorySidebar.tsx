
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, ChevronLeft, ChevronRight, Plus, Clock, FileText } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';
import { AnalysisDetailDrawer } from './AnalysisDetailDrawer';

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

  // Combine both types of analyses and sort by date
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
    setSelectedAnalysis(analysis);
    setIsDrawerOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getAnalysisPreview = (analysis: any) => {
    if (analysis.type === 'chat') {
      return truncateText(analysis.prompt_used || 'Chat analysis');
    }
    return truncateText(analysis.analysis_results?.analysis || 'Design analysis');
  };

  return (
    <>
      <div className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
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

        {/* New Analysis Button */}
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

        {/* History List */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading analyses...</div>
              ) : recentAnalyses.length === 0 ? (
                <div className="text-sm text-gray-500">No analyses found</div>
              ) : (
                recentAnalyses.map((analysis) => (
                  <Button
                    key={`${analysis.type}-${analysis.id}`}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto flex-col items-start hover:bg-blue-50"
                    onClick={() => handleAnalysisClick(analysis)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-sm">{analysis.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">→</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-left w-full">
                      {getAnalysisPreview(analysis)}
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Detail Drawer */}
      <AnalysisDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        analysis={selectedAnalysis}
      />
    </>
  );
};
