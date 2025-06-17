
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisListItemProps {
  analysis: any;
  isExpanded: boolean;
  onToggleExpanded: (analysisId: string) => void;
  onItemClick: (analysis: any) => void;
  onAnalysisSelect: (analysis: any) => void;
  truncateText: (text: string, maxLength?: number) => string;
}

export const AnalysisListItem: React.FC<AnalysisListItemProps> = ({
  analysis,
  isExpanded,
  onToggleExpanded,
  onItemClick,
  onAnalysisSelect,
  truncateText
}) => {
  return (
    <div className="rounded-lg">
      <div 
        className="p-3 hover:bg-blue-50 cursor-pointer"
        onClick={() => onItemClick(analysis)}
      >
        <div className="flex items-center gap-2 w-full">
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-sm">{truncateText(analysis.title)}</div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded(`${analysis.type}-${analysis.id}`);
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
};
