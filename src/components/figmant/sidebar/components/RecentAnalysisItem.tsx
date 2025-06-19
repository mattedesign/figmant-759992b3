
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, Users, TrendingUp, RotateCcw } from 'lucide-react';
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

  // Get key metrics for quick preview
  const getQuickMetrics = () => {
    const metrics = [];
    
    if (analysis.confidence_score) {
      metrics.push({
        icon: TrendingUp,
        label: `${Math.round(analysis.confidence_score * 100)}% confidence`,
        variant: 'secondary' as const
      });
    }
    
    if (analysis.impact_summary?.business_impact?.conversion_potential) {
      metrics.push({
        icon: TrendingUp,
        label: `${analysis.impact_summary.business_impact.conversion_potential}% conversion potential`,
        variant: 'outline' as const
      });
    }

    // Add attachment restoration indicator
    if (analysis.attachmentInfo?.hasAttachments || analysis.attachmentInfo?.hasDesignFile) {
      metrics.push({
        icon: RotateCcw,
        label: 'Restores artifacts',
        variant: 'outline' as const
      });
    }
    
    return metrics.slice(0, 2); // Limit to 2 metrics for space
  };

  const quickMetrics = getQuickMetrics();

  return (
    <div className="border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors overflow-hidden">
      {/* Analysis Header - Fully Clickable */}
      <div 
        className="p-3 cursor-pointer"
        onClick={handleItemClick}
      >
        <div className="flex items-start gap-3">
          {/* Analysis Image with attachment indicators */}
          <AnalysisImage analysis={analysis} title={analysis.title} />
          
          {/* Analysis Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {analysis.title}
            </h4>
            
            {/* Analysis Type and Score */}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {analysis.analysisType}
              </Badge>
              {analysis.score && (
                <Badge variant="secondary" className="text-xs">
                  Score: {analysis.score}/10
                </Badge>
              )}
            </div>
            
            {/* Quick Metrics (only show when not expanded) */}
            {!isExpanded && quickMetrics.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {quickMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Badge key={index} variant={metric.variant} className="text-xs px-1.5 py-0.5 h-4">
                      <IconComponent className="w-2.5 h-2.5 mr-1" />
                      {metric.label}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {/* Timestamp */}
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
          
          {/* Action Buttons */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {analysis.attachmentInfo?.attachmentCount ? 
                `Artifacts: ${analysis.attachmentInfo.attachmentCount}` : 
                `Files: ${analysis.fileCount}`} • Created {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalysisClick}
              className="h-7 text-xs px-3 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {analysis.type === 'chat' ? 'Restore Chat' : 'Load Analysis'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
