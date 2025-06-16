
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Image } from 'lucide-react';
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

  const AttachmentIcon = getAttachmentIcon();

  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
      <AttachmentIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <Badge 
          variant={
            attachment.status === 'uploaded' ? 'default' :
            attachment.status === 'uploading' ? 'secondary' : 'destructive'
          }
          className="text-xs mt-1"
        >
          {attachment.status}
        </Badge>
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
