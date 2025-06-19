
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
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
    <div className="px-3 space-y-4">
      {urlAttachments.map((attachment) => (
        <div key={attachment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
          {/* Screenshot/Preview */}
          <div className="aspect-video bg-gray-100">
            <ScreenshotDisplay attachment={attachment} />
          </div>
          
          {/* Link Details */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {attachment.name || 'Website Link'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 truncate flex-1 mr-2">
                {attachment.url}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAttachment(attachment.id)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-destructive hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
