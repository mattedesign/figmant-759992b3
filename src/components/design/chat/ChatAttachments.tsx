
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Image, Globe, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';

interface ChatAttachmentsProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}

export const ChatAttachments: React.FC<ChatAttachmentsProps> = ({ attachments, onRemove }) => {
  const getStatusIcon = (attachment: ChatAttachment) => {
    if (attachment.status === 'uploading') {
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
    if (attachment.status === 'uploading') return 'outline';
    return 'secondary';
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        Attachments ({attachments.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex flex-col gap-1">
            <Badge 
              variant={getBadgeVariant(attachment)} 
              className="flex items-center space-x-2 px-3 py-2"
            >
              {getFileIcon(attachment)}
              <span className="text-xs truncate max-w-[180px]">
                {attachment.name}
              </span>
              {getStatusIcon(attachment)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(attachment.id)}
                className="h-4 w-4 p-0 ml-2"
                disabled={attachment.status === 'uploading'}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
            {attachment.status === 'error' && attachment.errorMessage && (
              <div className="text-xs text-red-600 max-w-[200px] break-words px-1">
                {attachment.errorMessage}
              </div>
            )}
            {attachment.status === 'uploading' && (
              <div className="text-xs text-blue-600 px-1">
                Uploading...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
