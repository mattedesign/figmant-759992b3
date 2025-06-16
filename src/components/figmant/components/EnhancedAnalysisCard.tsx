
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Download,
  Share,
  Trash2,
  Eye,
  BarChart3,
  FileImage
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface EnhancedAnalysisCardProps {
  analysis: any;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (id: string) => void;
  onShare?: (analysis: any) => void;
  onDownload?: (analysis: any) => void;
}

export const EnhancedAnalysisCard: React.FC<EnhancedAnalysisCardProps> = ({
  analysis,
  isSelected,
  onClick,
  onDelete,
  onShare,
  onDownload
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: TrendingUp,
          label: 'Completed'
        };
      case 'processing':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Processing'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          label: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          label: 'Unknown'
        };
    }
  };

  const analysisTitle = analysis.design_upload?.file_name || 
                       analysis.batch_analysis?.name || 
                       `Analysis ${analysis.id.slice(0, 8)}`;
  
  const createdDate = analysis.created_at ? new Date(analysis.created_at) : new Date();
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const status = analysis.status || 'completed';
  const statusConfig = getStatusConfig(status);
  const confidence = Math.round((analysis.confidence_score || 0) * 100);
  
  const isBatchAnalysis = !!analysis.batch_id;
  const StatusIcon = statusConfig.icon;

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    switch (action) {
      case 'delete':
        onDelete?.(analysis.id);
        break;
      case 'share':
        onShare?.(analysis);
        break;
      case 'download':
        onDownload?.(analysis);
        break;
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
        isSelected 
          ? 'border-blue-300 bg-blue-50 shadow-sm' 
          : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isBatchAnalysis ? (
              <BarChart3 className="h-4 w-4 text-purple-600" />
            ) : (
              <FileImage className="h-4 w-4 text-blue-600" />
            )}
            <h3 className="font-medium text-gray-900 truncate">
              {analysisTitle}
            </h3>
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => handleAction('view', e)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleAction('download', e)}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleAction('share', e)}>
              <Share className="h-4 w-4 mr-2" />
              Share Analysis
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => handleAction('delete', e)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge 
          variant="secondary" 
          className={cn("text-xs border", statusConfig.color)}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
        
        {confidence > 0 && (
          <Badge variant="outline" className="text-xs">
            {confidence}% confidence
          </Badge>
        )}
        
        {isBatchAnalysis && (
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
            Batch
          </Badge>
        )}
      </div>

      {analysis.analysis_type && (
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">Type:</span> {analysis.analysis_type}
        </div>
      )}

      {analysis.impact_summary?.recommendations?.[0] && (
        <div className="text-xs text-gray-600">
          <p className="line-clamp-2">
            {analysis.impact_summary.recommendations[0].description}
          </p>
        </div>
      )}
    </div>
  );
};
