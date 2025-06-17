
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { AttachmentPreview } from '../AttachmentPreview';

interface AnalysisDetailsPanelProps {
  currentAnalysis?: any;
  attachments?: ChatAttachment[];
  onAnalysisClick?: () => void;
  onBackClick?: () => void;
  onRemoveAttachment?: (id: string) => void;
  lastAnalysisResult?: any;
}

export const AnalysisDetailsPanel: React.FC<AnalysisDetailsPanelProps> = ({
  currentAnalysis,
  attachments = [],
  onAnalysisClick,
  onBackClick,
  onRemoveAttachment,
  lastAnalysisResult
}) => {
  const handleRemoveAttachment = (attachmentId: string) => {
    if (onRemoveAttachment) {
      onRemoveAttachment(attachmentId);
    } else {
      console.log('Remove attachment:', attachmentId);
    }
  };

  // Determine status based on analysis state
  const getAnalysisStatus = () => {
    if (lastAnalysisResult) return 'Ready';
    if (currentAnalysis) return 'Processing';
    return 'Ready';
  };

  const getFileCount = () => {
    return attachments.length;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Back button only if provided */}
      {onBackClick && (
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Current Analysis Card */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Analysis</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Files:</span>
                <span className="text-lg font-bold text-gray-900">{getFileCount()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge 
                  variant={getAnalysisStatus() === 'Ready' ? 'default' : 'secondary'}
                  className="text-sm px-3 py-1"
                >
                  {getAnalysisStatus()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        {lastAnalysisResult && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <h5 className="text-sm font-medium text-gray-700">Analysis Complete</h5>
              <Badge variant="secondary" className="text-xs">
                Ready
              </Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 max-h-40 overflow-y-auto">
                {lastAnalysisResult.analysis || lastAnalysisResult.response || 'Analysis completed successfully'}
              </div>
              {lastAnalysisResult.debugInfo?.responseTimeMs && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {lastAnalysisResult.debugInfo.responseTimeMs}ms
                  </span>
                  {lastAnalysisResult.debugInfo?.tokensUsed && (
                    <Badge variant="outline" className="text-xs">
                      {lastAnalysisResult.debugInfo.tokensUsed} tokens
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Analysis */}
        {currentAnalysis && !lastAnalysisResult && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Current Analysis</h5>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{currentAnalysis.title || 'Analysis in progress...'}</p>
            </div>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">
              Attachments ({attachments.length})
            </h5>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={handleRemoveAttachment}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!currentAnalysis && !lastAnalysisResult && attachments.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h4 className="text-sm font-medium text-gray-500 mb-2">No Analysis Yet</h4>
            <p className="text-xs text-gray-400">
              Upload files or start a conversation to see analysis details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
