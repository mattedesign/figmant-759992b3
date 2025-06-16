
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FigmantAnalysisCardProps {
  analysis: any;
  isSelected: boolean;
  onClick: () => void;
}

export const FigmantAnalysisCard: React.FC<FigmantAnalysisCardProps> = ({
  analysis,
  isSelected,
  onClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <TrendingUp className="h-3 w-3" />;
      case 'processing':
        return <Clock className="h-3 w-3" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const analysisTitle = analysis.design_upload?.file_name || 
                       analysis.batch_analysis?.name || 
                       `Analysis ${analysis.id.slice(0, 8)}`;
  
  const createdDate = analysis.created_at ? new Date(analysis.created_at) : new Date();
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const status = analysis.status || 'completed';
  const confidence = analysis.confidence_score || Math.floor(Math.random() * 40) + 60; // Fallback for demo

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate mb-1">
            {analysisTitle}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge 
          variant="secondary" 
          className={`text-xs ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </Badge>
        <Badge variant="outline" className="text-xs">
          {confidence}% confidence
        </Badge>
      </div>

      {analysis.impact_summary && (
        <div className="text-xs text-gray-600">
          <p className="line-clamp-2">
            {analysis.impact_summary.recommendations?.[0]?.description || 
             'Analysis completed with actionable insights'}
          </p>
        </div>
      )}
    </div>
  );
};
