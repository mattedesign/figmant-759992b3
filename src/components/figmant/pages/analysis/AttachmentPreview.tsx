
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Image, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AttachmentPreviewProps {
  attachment: ChatAttachment;
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove
}) => {
  const getAttachmentIcon = () => {
    if (attachment.type === 'file' && attachment.file?.type.startsWith('image/')) {
      return Image;
    }
    return FileText;
  };

  const getStatusIcon = () => {
    switch (attachment.status) {
      case 'uploaded':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-600" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (attachment.status) {
      case 'uploaded':
        return 'Ready';
      case 'uploading':
        return 'Uploading';
      case 'processing':
        return 'Processing';
      case 'error':
        return attachment.error || 'Error';
      default:
        return attachment.status;
    }
  };

  const AttachmentIcon = getAttachmentIcon();

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
      <AttachmentIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <div className="flex items-center gap-1 mt-1">
          {getStatusIcon()}
          <Badge 
            variant={
              attachment.status === 'uploaded' ? 'default' :
              attachment.status === 'uploading' || attachment.status === 'processing' ? 'secondary' : 
              'destructive'
            }
            className="text-xs"
          >
            {getStatusText()}
          </Badge>
        </div>
        {attachment.status === 'error' && attachment.error && (
          <div className="text-xs text-red-600 mt-1 truncate" title={attachment.error}>
            {attachment.error}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(attachment.id)}
        className="h-6 w-6 p-0 flex-shrink-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
