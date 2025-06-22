
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Eye, FileText, Globe } from 'lucide-react';
import { EnhancedImage } from '../pages/analysis/components/EnhancedImage';

export interface AttachmentCardProps {
  attachment: {
    id: string;
    name: string;
    url?: string;
    type: 'file' | 'link' | 'image';
    thumbnailUrl?: string;
    file_name?: string;
    file_path?: string;
    file_size?: number;
    created_at?: string;
  };
  onClick?: () => void;
  showDownload?: boolean;
}

export const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onClick,
  showDownload = false
}) => {
  const isUrl = attachment.type === 'link' || attachment.url;
  const isImage = attachment.type === 'image' || attachment.thumbnailUrl;

  const handleDownload = () => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
  };

  return (
    <div 
      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail or Icon */}
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
          {isImage ? (
            <EnhancedImage
              attachment={attachment}
              className="w-full h-full"
              showFallback={true}
            />
          ) : isUrl ? (
            <Globe className="h-6 w-6 text-blue-500" />
          ) : (
            <FileText className="h-6 w-6 text-gray-500" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-sm text-gray-900 truncate">
            {attachment.file_name || attachment.name}
          </h5>
          {attachment.url && (
            <p className="text-xs text-gray-500 truncate mt-1">
              {attachment.url}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {attachment.type === 'link' ? 'URL' : attachment.type === 'image' ? 'Image' : 'File'}
            </Badge>
            
            {attachment.file_size && (
              <Badge variant="secondary" className="text-xs">
                {(attachment.file_size / 1024).toFixed(1)} KB
              </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 mt-2">
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(attachment.url, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            )}
            
            {showDownload && attachment.url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
