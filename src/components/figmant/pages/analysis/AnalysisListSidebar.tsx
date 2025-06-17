
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, ChevronDown, Star, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';
import { getTemplateIcon } from './components/TemplateIcon';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';
import { AnalysisDetailDrawer } from './AnalysisDetailDrawer';

interface AnalysisListSidebarProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const AnalysisListSidebar: React.FC<AnalysisListSidebarProps> = ({
  selectedAnalysis,
  onAnalysisSelect,
  onCollapseChange
}) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [drawerAnalysis, setDrawerAnalysis] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  // Combine both types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1
    })),
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 10);

  const toggleExpanded = (analysisId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(analysisId)) {
      newExpanded.delete(analysisId);
    } else {
      newExpanded.add(analysisId);
    }
    setExpandedItems(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleItemClick = (analysis: any) => {
    setDrawerAnalysis(analysis);
  };

  const handleCloseDrawer = () => {
    setDrawerAnalysis(null);
  };

  return (
    <>
      <div className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'min-w-[48px]' : 'w-full'
      }`}>
        {/* Header */}
        <div className="p-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {!isCollapsed && <h2 className="text-xl font-semibold pl-3">History</h2>}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
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

        {!isCollapsed && (
          <>
            {/* New Analysis Button */}
            <div className="p-4 border-b border-gray-200">
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>

            {/* Recent Analyses */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-sm text-gray-500">Loading analyses...</div>
                  ) : recentAnalyses.length === 0 ? (
                    <div className="text-sm text-gray-500">No analyses found</div>
                  ) : (
                    recentAnalyses.map((analysis) => {
                      const TemplateIcon = getTemplateIcon(analysis.analysisType);
                      const isExpanded = expandedItems.has(`${analysis.type}-${analysis.id}`);
                      
                      return (
                        <div key={`${analysis.type}-${analysis.id}`} className="rounded-lg">
                          <div 
                            className="p-3 hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleItemClick(analysis)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <TemplateIcon className="w-3 h-3 text-blue-500" />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <div className="font-medium text-sm">{truncateText(analysis.title)}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(`${analysis.type}-${analysis.id}`);
                                }}
                                className="text-xs text-gray-400 hover:text-gray-600"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="px-3 pb-3 border-t border-gray-100">
                              <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Files:</span>
                                  <span className="font-medium">{analysis.fileCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">Overall Score:</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="font-medium">{analysis.score}/10</span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAnalysisSelect(analysis);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Collapsed state content */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center pt-4 space-y-4">
            <Button
              size="sm"
              className="w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
              title="New Analysis"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {recentAnalyses.slice(0, 5).map((analysis) => {
              const TemplateIcon = getTemplateIcon(analysis.analysisType);
              return (
                <Button
                  key={`${analysis.type}-${analysis.id}`}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => handleItemClick(analysis)}
                  title={analysis.title}
                >
                  <TemplateIcon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Analysis Detail Drawer */}
      <AnalysisDetailDrawer
        isOpen={!!drawerAnalysis}
        onClose={handleCloseDrawer}
        analysis={drawerAnalysis}
      />
    </>
  );
};
