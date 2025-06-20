
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Clock, FileText, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AnalysisDetailModal } from '../../pages/dashboard/components/AnalysisDetailModal';

interface RecentAnalysisItemProps {
  analysis: any;
  isExpanded: boolean;
  onToggleExpanded: (analysisId: string, event: React.MouseEvent) => void;
  onAnalysisClick: (analysis: any) => void;
}

export const RecentAnalysisItem: React.FC<RecentAnalysisItemProps> = ({
  analysis,
  isExpanded,
  onToggleExpanded,
  onAnalysisClick
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleAnalysisClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Opening analysis modal from sidebar:', analysis);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const analysisId = `${analysis.type}-${analysis.id}`;
  const Icon = analysis.type === 'chat' ? MessageSquare : FileText;
  
  const getConfidenceScore = () => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    return analysis.impact_summary?.key_metrics?.overall_score * 10 || 85;
  };

  return (
    <>
      <div className="group rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
        <div
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={handleAnalysisClick}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {analysis.displayTitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getConfidenceScore()}%
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => onToggleExpanded(analysisId, e)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 border-t border-gray-100">
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Type:</span> {analysis.analysis_type || 'General'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {analysis.status || 'Completed'}
              </div>
              {analysis.analysis_results && (
                <div className="mt-2">
                  <div className="font-medium mb-1">Preview:</div>
                  <div className="text-xs bg-gray-50 p-2 rounded text-gray-700 line-clamp-3">
                    {typeof analysis.analysis_results === 'string' 
                      ? analysis.analysis_results.slice(0, 100) + '...'
                      : analysis.analysis_results.response?.slice(0, 100) + '...' || 'No preview available'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Detail Modal */}
      <AnalysisDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        analysis={analysis}
      />
    </>
  );
};
