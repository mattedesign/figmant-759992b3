
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Globe, FileText, X } from 'lucide-react';
import { SingleAttachmentDisplayProps } from './types';

export const SingleAttachmentDisplay: React.FC<SingleAttachmentDisplayProps> = ({
  attachment,
  size = 'md',
  showRemove = false,
  onRemove
}) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-20 w-20', 
    lg: 'h-24 w-24'
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const getIcon = () => {
    if (attachment.type === 'file') {
      return attachment.file?.type?.startsWith('image/') ? 
        <Camera className={iconSize} /> : 
        <FileText className={iconSize} />;
    }
    return <Globe className={iconSize} />;
  };

  return (
    <div className={`relative ${sizeClasses[size]} bg-gray-100 rounded-lg flex items-center justify-center border`}>
      {attachment.type === 'file' && attachment.file?.type?.startsWith('image/') && attachment.uploadPath ? (
        <img 
          src={attachment.uploadPath} 
          alt={attachment.name}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2">
          {getIcon()}
          <span className="text-xs mt-1 truncate max-w-full text-center">
            {attachment.name}
          </span>
        </div>
      )}
      
      {showRemove && onRemove && (
        <Button
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 p-0"
          onClick={() => onRemove(attachment.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
