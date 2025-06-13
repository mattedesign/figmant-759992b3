
import React from 'react';
import { EnhancedAttachmentStatus } from './EnhancedAttachmentStatus';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-3">
      <EnhancedAttachmentStatus
        attachments={attachments}
        onRemove={onRemove}
        onRetry={onRetry}
      />
      
      {attachments.length > 1 && onClearAll && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};
