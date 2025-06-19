
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ScreenshotDisplay } from './ScreenshotDisplay';

interface WebsiteAttachmentsSectionProps {
  urlAttachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
}

export const WebsiteAttachmentsSection: React.FC<WebsiteAttachmentsSectionProps> = ({
  urlAttachments,
  onRemoveAttachment
}) => {
  if (urlAttachments.length === 0) return null;

  return (
    <div className="mt-2 px-3 space-y-2">
      {urlAttachments.map((attachment) => (
        <div key={attachment.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-muted-foreground truncate">{attachment.url}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAttachment(attachment.id)}
              className="h-5 w-5 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          <ScreenshotDisplay attachment={attachment} />
        </div>
      ))}
    </div>
  );
};
