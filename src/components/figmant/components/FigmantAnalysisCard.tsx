
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart3 } from 'lucide-react';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceScore = () => {
    return Math.round((analysis.confidence_score || 0.8) * 100);
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {analysis.title || analysis.file_name || 'Untitled Analysis'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {analysis.analysis_type || 'Design Analysis'}
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(analysis.status)}`}
            >
              {analysis.status || 'completed'}
            </Badge>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>{getConfidenceScore()}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(analysis.created_at)}</span>
            </div>
          </div>

          {/* Preview */}
          {analysis.impact_summary?.key_metrics?.overall_score && (
            <div className="bg-muted/50 rounded-md p-2">
              <div className="text-xs font-medium mb-1">Overall Score</div>
              <div className="text-lg font-bold text-primary">
                {analysis.impact_summary.key_metrics.overall_score}/10
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
