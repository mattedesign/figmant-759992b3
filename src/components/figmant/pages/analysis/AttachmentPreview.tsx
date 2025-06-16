
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AttachmentPreviewProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemove
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="flex flex-wrap gap-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
            <span className="text-sm truncate max-w-32">{attachment.name}</span>
            <Badge variant={
              attachment.status === 'uploaded' ? 'default' :
              attachment.status === 'uploading' ? 'secondary' : 'destructive'
            }>
              {attachment.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(attachment.id)}
              className="h-5 w-5 p-0"
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
