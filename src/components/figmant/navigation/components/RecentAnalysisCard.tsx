
import React from 'react';
import { MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

interface RecentAnalysisCardProps {
  analysis: SavedChatAnalysis;
  onClick: () => void;
}

export const RecentAnalysisCard: React.FC<RecentAnalysisCardProps> = ({
  analysis,
  onClick
}) => {
  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'competitor_analysis':
        return TrendingUp;
      case 'revenue_impact':
        return TrendingUp;
      default:
        return MessageSquare;
    }
  };

  const formatAnalysisType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const Icon = getAnalysisTypeIcon(analysis.analysis_type);

  return (
    <div
      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {formatAnalysisType(analysis.analysis_type)}
            </h4>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getConfidenceColor(analysis.confidence_score)}`}
            >
              {Math.round(analysis.confidence_score * 100)}%
            </Badge>
          </div>

          {/* Prompt Preview */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {analysis.prompt_used.length > 80 
              ? `${analysis.prompt_used.substring(0, 80)}...` 
              : analysis.prompt_used}
          </p>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(analysis.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
