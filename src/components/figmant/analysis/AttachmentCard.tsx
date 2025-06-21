
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Image, Link, Download, ExternalLink } from 'lucide-react';

interface AttachmentCardProps {
  attachment: {
    id: string;
    file_name?: string;
    file_type?: string;
    file_path?: string;
    file_size?: number;
    url?: string;
    link_title?: string;
    link_description?: string;
    link_thumbnail?: string;
    type?: 'file' | 'image' | 'link';
  };
  onClick?: () => void;
  showDownload?: boolean;
}

export const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onClick,
  showDownload = false
}) => {
  const getAttachmentIcon = () => {
    const type = attachment.type || attachment.file_type?.toLowerCase();
    
    if (type?.includes('image') || attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return Image;
    } else if (attachment.url || type === 'link') {
      return Link;
    } else {
      return FileText;
    }
  };

  const getAttachmentTitle = () => {
    return attachment.link_title || attachment.file_name || 'Untitled';
  };

  const getAttachmentSize = () => {
    if (!attachment.file_size) return '';
    const sizeInKB = Math.round(attachment.file_size / 1024);
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${Math.round(sizeInKB / 1024)} MB`;
  };

  const getAttachmentType = () => {
    return attachment.file_type || attachment.type || 'Unknown';
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachment.file_path) {
      // Create download link
      const link = document.createElement('a');
      link.href = attachment.file_path;
      link.download = attachment.file_name || 'download';
      link.click();
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
  };

  const Icon = getAttachmentIcon();

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500 ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Thumbnail or Icon */}
          <div className="flex-shrink-0">
            {attachment.link_thumbnail ? (
              <img
                src={attachment.link_thumbnail}
                alt="Link thumbnail"
                className="w-12 h-12 object-cover rounded-md"
              />
            ) : attachment.file_path?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={attachment.file_path}
                alt={attachment.file_name}
                className="w-12 h-12 object-cover rounded-md"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {getAttachmentTitle()}
                </h4>
                {attachment.link_description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {attachment.link_description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {getAttachmentType()}
                  </Badge>
                  {attachment.file_size && (
                    <span className="text-xs text-gray-500">
                      {getAttachmentSize()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {showDownload && attachment.file_path && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {attachment.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExternalLink}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
