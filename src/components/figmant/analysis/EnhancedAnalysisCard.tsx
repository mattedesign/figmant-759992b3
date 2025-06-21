
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Image, 
  Paperclip, 
  Clock, 
  Star,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';
import { AttachmentCard } from './AttachmentCard';
import { ScreenshotModal } from './ScreenshotModal';
import { 
  extractAttachmentsFromChatAnalysis, 
  extractScreenshotsFromChatAnalysis,
  extractAttachmentsFromWizardAnalysis,
  extractScreenshotsFromWizardAnalysis,
  AnalysisAttachment,
  AnalysisScreenshot
} from '@/utils/analysisAttachments';

interface EnhancedAnalysisCardProps {
  analysis: any;
  onViewDetails: (analysis: any) => void;
  className?: string;
}

export const EnhancedAnalysisCard: React.FC<EnhancedAnalysisCardProps> = ({
  analysis,
  onViewDetails,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<AnalysisScreenshot | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Extract attachments and screenshots based on analysis type
  const attachments: AnalysisAttachment[] = analysis.type === 'chat' 
    ? extractAttachmentsFromChatAnalysis(analysis).map(att => ({
        ...att,
        file_name: att.name,
        file_path: att.url,
        created_at: new Date().toISOString()
      }))
    : extractAttachmentsFromWizardAnalysis(analysis).map(att => ({
        ...att,
        file_name: att.name,
        file_path: att.url,
        created_at: new Date().toISOString()
      }));
  
  const screenshots: AnalysisScreenshot[] = analysis.type === 'chat'
    ? extractScreenshotsFromChatAnalysis(analysis)
    : extractScreenshotsFromWizardAnalysis(analysis);

  const getAnalysisIcon = () => {
    if (analysis.type === 'chat') return MessageSquare;
    if (analysis.type === 'wizard') return Sparkles;
    return FileText;
  };

  const getAnalysisTitle = () => {
    return analysis.displayTitle || analysis.title || 'Analysis';
  };

  const getConfidenceScore = () => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    if (analysis.score) {
      return analysis.score * 10;
    }
    return 85;
  };

  const getAnalysisPreview = () => {
    if (analysis.type === 'chat') {
      return analysis.analysis_results?.response?.slice(0, 150) + '...' || 'No preview available';
    }
    return analysis.analysis_results?.summary?.slice(0, 150) + '...' || 'Analysis completed';
  };

  const handleScreenshotClick = (screenshot: AnalysisScreenshot) => {
    setSelectedScreenshot(screenshot);
    setShowScreenshotModal(true);
  };

  const handleAttachmentClick = (attachment: AnalysisAttachment) => {
    if (attachment.type === 'image') {
      setSelectedScreenshot({
        id: attachment.id,
        name: attachment.name,
        url: attachment.url,
        thumbnailUrl: attachment.thumbnailUrl,
        file_name: attachment.file_name || attachment.name,
        file_path: attachment.file_path || attachment.url,
        file_size: attachment.file_size,
        created_at: attachment.created_at
      });
      setShowScreenshotModal(true);
    } else if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
  };

  const Icon = getAnalysisIcon();

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-lg border-l-4 ${
        analysis.type === 'chat' ? 'border-l-blue-500' : 
        analysis.type === 'wizard' ? 'border-l-purple-500' : 
        'border-l-green-500'
      } ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                analysis.type === 'chat' ? 'bg-blue-100' : 
                analysis.type === 'wizard' ? 'bg-purple-100' : 
                'bg-green-100'
              }`}>
                <Icon className={`h-5 w-5 ${
                  analysis.type === 'chat' ? 'text-blue-600' : 
                  analysis.type === 'wizard' ? 'text-purple-600' : 
                  'text-green-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {getAnalysisTitle()}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={analysis.type === 'chat' ? 'default' : 'secondary'} className="text-xs">
                    {analysis.type === 'chat' ? 'Chat Analysis' : 
                     analysis.type === 'wizard' ? 'Premium Wizard' : 
                     'Design Analysis'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{getConfidenceScore()}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(analysis)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Analysis Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}</span>
            </div>
            {attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{attachments.length} attachment{attachments.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {screenshots.length > 0 && (
              <div className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                <span>{screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Analysis Preview */}
          <div className="text-sm text-gray-600 mb-3">
            {getAnalysisPreview()}
          </div>

          {/* Screenshots Preview */}
          {screenshots.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Screenshots</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {screenshots.slice(0, 3).map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleScreenshotClick(screenshot)}
                  >
                    <img
                      src={screenshot.file_path || screenshot.url || screenshot.thumbnailUrl}
                      alt={screenshot.file_name || screenshot.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </div>
                ))}
                {screenshots.length > 3 && (
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-500">
                    +{screenshots.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              {/* Analysis Type and Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-1 text-gray-600">
                    {analysis.analysisType || analysis.analysis_type || 'General'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-1 text-gray-600">
                    {analysis.status || 'Completed'}
                  </span>
                </div>
              </div>

              {/* All Attachments */}
              {attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {attachments.slice(0, 2).map((attachment) => (
                      <AttachmentCard
                        key={attachment.id}
                        attachment={attachment}
                        onClick={() => handleAttachmentClick(attachment)}
                        showDownload={true}
                      />
                    ))}
                    {attachments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        +{attachments.length - 2} more attachments
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Screenshot Modal */}
      <ScreenshotModal
        isOpen={showScreenshotModal}
        onClose={() => setShowScreenshotModal(false)}
        screenshot={selectedScreenshot}
      />
    </>
  );
};
