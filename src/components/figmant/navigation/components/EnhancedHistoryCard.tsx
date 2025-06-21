
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  FileText, 
  Clock, 
  Eye,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getAttachmentsFromAnalysis,
  getAnalysisTitle,
  getAnalysisSummary,
  getFirstScreenshot
} from '@/utils/analysisAttachments';

interface EnhancedHistoryCardProps {
  analysis: any;
  onViewDetails: (analysis: any) => void;
  className?: string;
}

export const EnhancedHistoryCard: React.FC<EnhancedHistoryCardProps> = ({
  analysis,
  onViewDetails,
  className
}) => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  const title = getAnalysisTitle(analysis);
  const summary = getAnalysisSummary(analysis);
  const firstScreenshot = getFirstScreenshot(analysis);
  
  const handleCardClick = () => {
    onViewDetails(analysis);
  };

  const getTypeIcon = () => {
    if (analysis.type === 'chat') {
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
    return <FileText className="h-4 w-4 text-green-600" />;
  };

  const getTypeBadge = () => {
    const isChat = analysis.type === 'chat';
    return (
      <Badge 
        variant={isChat ? 'default' : 'secondary'} 
        className="text-xs h-5"
      >
        {isChat ? 'Chat' : 'Design'}
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer group",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon/Screenshot */}
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {firstScreenshot ? (
            <img
              src={firstScreenshot}
              alt="Analysis preview"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={cn(
            "w-full h-full rounded-lg flex items-center justify-center",
            firstScreenshot ? 'hidden' : '',
            analysis.type === 'chat' ? 'bg-blue-100' : 'bg-green-100'
          )}>
            {getTypeIcon()}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm text-gray-900 truncate">
              {title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(analysis);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Metadata row */}
          <div className="flex items-center gap-2 mb-2">
            {getTypeBadge()}
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
              </span>
            </div>
            
            {attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {attachments.some(att => att.type === 'image' || att.thumbnailUrl) ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
                <span>{attachments.length}</span>
              </div>
            )}
          </div>
          
          {/* Summary */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
