
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileImage, Globe, FileText, ExternalLink, Eye } from 'lucide-react';
import { AttachmentReferenceProps } from '@/types/contextualAnalysis';

export const AttachmentReference: React.FC<AttachmentReferenceProps> = ({
  attachment,
  onClick,
  showPreview = true,
  size = 'medium'
}) => {
  const getIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <FileImage className="h-4 w-4" />;
      case 'url':
        return <Globe className="h-4 w-4" />;
      case 'figma':
        return (
          <div className="h-4 w-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
        );
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDisplayName = () => {
    if (attachment.type === 'url' && attachment.metadata?.domain) {
      return attachment.metadata.domain;
    }
    return attachment.name.length > 20 ? 
      `${attachment.name.substring(0, 20)}...` : 
      attachment.name;
  };

  const getTypeLabel = () => {
    switch (attachment.type) {
      case 'image':
        return 'Image';
      case 'url':
        return 'Website';
      case 'figma':
        return 'Figma';
      default:
        return 'File';
    }
  };

  const sizeClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  const thumbnailSizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div 
      className={`border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${sizeClasses[size]} ${
        onClick ? 'hover:border-blue-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail or Icon */}
        <div className={`bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden ${thumbnailSizes[size]}`}>
          {showPreview && attachment.thumbnailUrl && attachment.type === 'image' ? (
            <img
              src={attachment.thumbnailUrl}
              alt={attachment.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            getIcon()
          )}
          {showPreview && attachment.thumbnailUrl && attachment.type === 'image' && (
            <div className="hidden w-full h-full flex items-center justify-center">
              {getIcon()}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium text-sm text-gray-900 truncate">
              {getDisplayName()}
            </h5>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {getTypeLabel()}
            </Badge>
          </div>
          
          {size !== 'small' && (
            <>
              {attachment.fileSize && (
                <p className="text-xs text-gray-500 mb-1">
                  {(attachment.fileSize / 1024).toFixed(1)} KB
                </p>
              )}
              
              {attachment.metadata?.domain && attachment.type === 'url' && (
                <p className="text-xs text-gray-500 truncate mb-2">
                  {attachment.url}
                </p>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
