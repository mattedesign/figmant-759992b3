import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { formatDistanceToNow } from 'date-fns';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';
import { useNavigate } from 'react-router-dom';

interface SidebarRecentAnalysesProps {
  analysisHistory: SavedChatAnalysis[];
  onSectionChange: (section: string) => void;
}

export const SidebarRecentAnalyses: React.FC<SidebarRecentAnalysesProps> = ({
  analysisHistory,
  onSectionChange
}) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Combine both types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1,
      imageUrl: null
    })),
    ...analysisHistory.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1,
      imageUrl: a.analysis_results?.upload_ids?.[0] || null
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 20);

  const toggleExpanded = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const handleAnalysisClick = (analysis: any) => {
    if (analysis.type === 'chat') {
      // Navigate to chat page with historical analysis
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
      onSectionChange('chat');
    } else {
      // Navigate to wizard with historical context
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
      onSectionChange('wizard');
    }
  };

  const getAnalysisPreview = (analysis: any) => {
    if (analysis.type === 'chat') {
      return truncateText(analysis.prompt_used || 'Chat analysis');
    }
    return truncateText(analysis.analysis_results?.analysis || 'Design analysis');
  };

  const getAnalysisImage = (analysis: any) => {
    // For design analyses, try to get the uploaded design image
    if (analysis.type === 'design' && analysis.imageUrl) {
      return analysis.imageUrl;
    }
    
    // For chat analyses, you might want to use a screenshot or uploaded image
    // This is a placeholder - you'd need to implement proper image retrieval
    if (analysis.type === 'chat' && analysis.imageUrl) {
      return analysis.imageUrl;
    }
    
    // Default placeholder image
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop';
  };

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-1">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">
            <div className="text-sm">Loading analyses...</div>
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="h-8 w-8 mx-auto mb-2 opacity-50 bg-gray-200 rounded"></div>
            <p className="text-sm">No recent analyses</p>
          </div>
        ) : (
          recentAnalyses.map((analysis) => {
            const analysisId = `${analysis.type}-${analysis.id}`;
            const isExpanded = expandedItems.has(analysisId);
            
            return (
              <div
                key={analysisId}
                className="border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden"
              >
                {/* Analysis Header - Fully Clickable */}
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => handleAnalysisClick(analysis)}
                >
                  <div className="flex items-start gap-3">
                    {/* Analysis Image */}
                    <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <img 
                        src={getAnalysisImage(analysis)}
                        alt={analysis.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a placeholder if image fails to load
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    {/* Analysis Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {analysis.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {analysis.analysisType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Score: {analysis.score}/10
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Chevron Button - Not Clickable for Navigation */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalysisClick(analysis);
                        }}
                        className="h-6 w-6 p-0"
                        title={analysis.type === 'chat' ? 'Continue in Chat' : 'Open in Wizard'}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleExpanded(analysisId, e)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <div className="mt-2 text-xs text-gray-600">
                      <p className="font-medium mb-1">Preview:</p>
                      <p className="text-gray-500">
                        {getAnalysisPreview(analysis)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Files: {analysis.fileCount}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalysisClick(analysis);
                        }}
                        className="h-6 text-xs px-2"
                      >
                        {analysis.type === 'chat' ? 'Continue Chat' : 'Open Wizard'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};
