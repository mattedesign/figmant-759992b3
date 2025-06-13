
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Image, Globe, File, AlertCircle, CheckCircle, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';

interface ChatAttachmentsProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  onClearAll?: () => void;
}

export const ChatAttachments: React.FC<ChatAttachmentsProps> = ({ 
  attachments, 
  onRemove, 
  onRetry,
  onClearAll 
}) => {
  const getStatusIcon = (attachment: ChatAttachment) => {
    if (attachment.status === 'uploading' || attachment.status === 'processing') {
      return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
    }
    if (attachment.status === 'error') {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
    if (attachment.status === 'uploaded') {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
    return null;
  };

  const getFileIcon = (attachment: ChatAttachment) => {
    if (attachment.type === 'url') {
      return <Globe className="h-3 w-3" />;
    }
    if (attachment.file?.type.startsWith('image/')) {
      return <Image className="h-3 w-3" />;
    }
    return <File className="h-3 w-3" />;
  };

  const getBadgeVariant = (attachment: ChatAttachment) => {
    if (attachment.status === 'error') return 'destructive';
    if (attachment.status === 'uploading' || attachment.status === 'processing') return 'outline';
    return 'secondary';
  };

  const getUploadProgress = (attachment: ChatAttachment) => {
    if (attachment.status === 'uploading') return 50;
    if (attachment.status === 'processing') return 75;
    if (attachment.status === 'uploaded') return 100;
    return 0;
  };

  const hasErrors = attachments.some(att => att.status === 'error');
  const hasProcessing = attachments.some(att => 
    att.status === 'uploading' || att.status === 'processing'
  );

  if (attachments.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          Attachments ({attachments.length})
        </div>
        
        {(hasErrors || attachments.length > 1) && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="space-y-2">
            <Badge 
              variant={getBadgeVariant(attachment)} 
              className="flex items-center justify-between w-full px-3 py-2"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getFileIcon(attachment)}
                <span className="text-xs truncate flex-1">
                  {attachment.name}
                </span>
                {getStatusIcon(attachment)}
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                {attachment.status === 'error' && onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRetry(attachment.id)}
                    className="h-4 w-4 p-0"
                    title="Retry upload"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(attachment.id)}
                  className="h-4 w-4 p-0"
                  disabled={attachment.status === 'uploading'}
                  title="Remove attachment"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Badge>

            {/* Progress bar for uploading/processing files */}
            {(attachment.status === 'uploading' || attachment.status === 'processing') && (
              <div className="px-1">
                <Progress 
                  value={getUploadProgress(attachment)} 
                  className="h-1"
                />
                <div className="text-xs text-blue-600 mt-1">
                  {attachment.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                </div>
              </div>
            )}

            {/* Error message */}
            {attachment.status === 'error' && attachment.errorMessage && (
              <div className="text-xs text-red-600 px-1 bg-red-50 rounded p-2 border border-red-200">
                <div className="font-medium">Upload failed:</div>
                <div className="break-words">{attachment.errorMessage}</div>
              </div>
            )}

            {/* Success info */}
            {attachment.status === 'uploaded' && attachment.processingInfo && (
              <div className="text-xs text-green-600 px-1">
                {attachment.processingInfo.compressionRatio > 0 && (
                  <div>Compressed by {attachment.processingInfo.compressionRatio}%</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status summary */}
      {hasProcessing && (
        <div className="text-xs text-blue-600 bg-blue-50 rounded p-2 border border-blue-200">
          Processing files... Please wait before sending your message.
        </div>
      )}
    </div>
  );
};
