
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Image, AlertTriangle, Loader2, CheckCircle, Eye } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AttachmentPreviewProps {
  attachment: ChatAttachment;
  onRemove: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove
}) => {
  const [showPreview, setShowPreview] = useState(false);

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
      case 'pending':
        return 'Pending';
      case 'error':
        return attachment.errorMessage || attachment.error || 'Error';
      default:
        return attachment.status;
    }
  };

  const isImage = attachment.type === 'file' && attachment.file?.type.startsWith('image/');
  const canPreview = isImage && attachment.status === 'uploaded' && attachment.url;

  const AttachmentIcon = getAttachmentIcon();

  const handlePreview = () => {
    if (canPreview) {
      setShowPreview(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
        <AttachmentIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div 
            className={`text-sm font-medium truncate ${canPreview ? 'cursor-pointer hover:text-blue-600' : ''}`}
            onClick={handlePreview}
            title={canPreview ? 'Click to preview' : attachment.name}
          >
            {attachment.name}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {getStatusIcon()}
            <Badge 
              variant={
                attachment.status === 'uploaded' ? 'default' :
                attachment.status === 'uploading' || attachment.status === 'processing' || attachment.status === 'pending' ? 'secondary' : 
                'destructive'
              }
              className="text-xs"
            >
              {getStatusText()}
            </Badge>
          </div>
          {attachment.status === 'error' && (attachment.errorMessage || attachment.error) && (
            <div className="text-xs text-red-600 mt-1 truncate" title={attachment.errorMessage || attachment.error}>
              {attachment.errorMessage || attachment.error}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {canPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-6 w-6 p-0 flex-shrink-0"
              title="Preview image"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(attachment.id)}
            className="h-6 w-6 p-0 flex-shrink-0"
            title="Remove attachment"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {canPreview && (
        <ImagePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          imageName={attachment.name}
          imageUrl={attachment.url!}
        />
      )}
    </>
  );
};
