
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AnalysisImage } from './AnalysisImage';
import { AnalysisPreview } from './AnalysisPreview';
import { AnalysisItemControls } from './AnalysisItemControls';

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
  const analysisId = `${analysis.type}-${analysis.id}`;

  const handleToggleExpanded = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleExpanded(analysisId, event);
  };

  const handleAnalysisClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onAnalysisClick(analysis);
  };

  const handleItemClick = () => {
    onAnalysisClick(analysis);
  };

  return (
    <div className="border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden">
      {/* Analysis Header - Fully Clickable */}
      <div 
        className="p-3 cursor-pointer"
        onClick={handleItemClick}
      >
        <div className="flex items-start gap-3">
          {/* Analysis Image */}
          <AnalysisImage analysis={analysis} title={analysis.title} />
          
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

          {/* Controls */}
          <AnalysisItemControls
            isExpanded={isExpanded}
            onToggleExpanded={handleToggleExpanded}
            onAnalysisClick={handleAnalysisClick}
            analysisType={analysis.type}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <AnalysisPreview analysis={analysis} />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Files: {analysis.fileCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalysisClick}
              className="h-6 text-xs px-2"
            >
              {analysis.type === 'chat' ? 'Continue Chat' : 'Open Wizard'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
