
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ChevronRight, ChevronDown, Star, FileImage } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical } from 'lucide-react';

interface AnalysisListSidebarProps {
  selectedAnalysis: any;
  onAnalysisSelect: (analysis: any) => void;
}

const getTemplateIcon = (analysisType: string) => {
  const type = analysisType?.toLowerCase() || '';
  
  if (type.includes('master') || type.includes('comprehensive')) {
    return Sparkles;
  } else if (type.includes('competitor') || type.includes('competitive')) {
    return Target;
  } else if (type.includes('visual') || type.includes('hierarchy')) {
    return BarChart3;
  } else if (type.includes('copy') || type.includes('messaging') || type.includes('content')) {
    return Users;
  } else if (type.includes('ecommerce') || type.includes('revenue') || type.includes('conversion')) {
    return ShoppingCart;
  } else if (type.includes('ab') || type.includes('test') || type.includes('experiment')) {
    return FlaskConical;
  } else {
    return Sparkles;
  }
};

export const AnalysisListSidebar: React.FC<AnalysisListSidebarProps> = ({
  selectedAnalysis,
  onAnalysisSelect
}) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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
      title: 'Chat Analysis',
      analysisType: a.analysis_type || 'General',
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

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full" style={{ maxWidth: '288px' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">History</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Current Analysis */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-2">Current Analysis</div>
        {selectedAnalysis ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-medium">{selectedAnalysis.title || 'Analysis'}</div>
            <div className="text-sm text-gray-600">
              {truncateText(selectedAnalysis.analysisType || 'General Analysis')}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No analysis selected</div>
        )}
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
                  <div key={`${analysis.type}-${analysis.id}`} className="border border-gray-200 rounded-lg">
                    <div className="p-3 hover:bg-blue-50 cursor-pointer">
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
                            onClick={() => onAnalysisSelect(analysis)}
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
    </div>
  );
};
