
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, Download, Eye, X } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface AttachmentPreviewCardProps {
  attachment: ChatAttachment;
  onDelete?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

export const AttachmentPreviewCard: React.FC<AttachmentPreviewCardProps> = ({
  attachment,
  onDelete,
  onView,
  showActions = true
}) => {
  const isImage = attachment.file?.type.startsWith('image/') || attachment.thumbnailUrl;
  
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
      {/* Thumbnail or Icon */}
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
        {isImage && attachment.thumbnailUrl ? (
          <img
            src={attachment.thumbnailUrl}
            alt={attachment.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : isImage ? (
          <ImageIcon className="h-6 w-6 text-blue-500" />
        ) : (
          <FileText className="h-6 w-6 text-gray-500" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h5 className="font-medium text-sm text-gray-900 truncate">
          {attachment.name}
        </h5>
        
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {isImage ? 'Image' : 'File'}
          </Badge>
          
          {attachment.fileSize && (
            <Badge variant="secondary" className="text-xs">
              {(attachment.fileSize / 1024).toFixed(1)} KB
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-1 mt-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onView}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            
            {attachment.url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => window.open(attachment.url, '_blank')}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="p-1 h-8 w-8 text-gray-400 hover:text-destructive hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
