
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Image, Globe, File } from 'lucide-react';
import { ChatAttachment } from '../DesignChatInterface';

interface ChatAttachmentsProps {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}

export const ChatAttachments: React.FC<ChatAttachmentsProps> = ({ attachments, onRemove }) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        Attachments ({attachments.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <Badge key={attachment.id} variant="secondary" className="flex items-center space-x-2 px-3 py-2">
            {attachment.type === 'file' ? (
              attachment.file?.type.startsWith('image/') ? (
                <Image className="h-3 w-3" />
              ) : (
                <File className="h-3 w-3" />
              )
            ) : (
              <Globe className="h-3 w-3" />
            )}
            <span className="text-xs truncate max-w-[200px]">
              {attachment.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(attachment.id)}
              className="h-4 w-4 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
