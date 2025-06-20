
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Globe, Image, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AttachmentPreviewListProps {
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
}

export const AttachmentPreviewList: React.FC<AttachmentPreviewListProps> = ({
  attachments,
  onRemoveAttachment
}) => {
  const getAttachmentIcon = (attachment: ChatAttachment) => {
    switch (attachment.type) {
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (attachment: ChatAttachment) => {
    switch (attachment.status) {
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'uploaded':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Ready
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAttachmentPreview = (attachment: ChatAttachment) => {
    if (attachment.type === 'url' && attachment.metadata?.screenshots) {
      const desktopScreenshot = attachment.metadata.screenshots.desktop;
      if (desktopScreenshot?.success && desktopScreenshot.screenshotUrl) {
        return (
          <img
            src={desktopScreenshot.screenshotUrl}
            alt={`Screenshot of ${attachment.name}`}
            className="w-12 h-8 object-cover rounded border"
          />
        );
      }
    }
    
    if (attachment.url && attachment.url.startsWith('data:image/')) {
      return (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-12 h-8 object-cover rounded border"
        />
      );
    }

    return (
      <div className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center">
        {getAttachmentIcon(attachment)}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        Attachments ({attachments.length})
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border"
          >
            {/* Preview */}
            {getAttachmentPreview(attachment)}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium truncate">
                  {attachment.name}
                </span>
                {getStatusBadge(attachment)}
              </div>
              {attachment.url && attachment.type === 'url' && (
                <p className="text-xs text-gray-500 truncate">
                  {attachment.url}
                </p>
              )}
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAttachment(attachment.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
