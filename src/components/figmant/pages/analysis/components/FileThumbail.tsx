
import React from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { FileText, Image, File, AlertCircle, Loader2 } from 'lucide-react';

interface FileThumbailProps {
  attachment: ChatAttachment;
  size?: 'sm' | 'md' | 'lg';
}

export const FileThumbail: React.FC<FileThumbailProps> = ({ 
  attachment, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getFileIcon = () => {
    if (!attachment.file) return File;
    
    const fileType = attachment.file.type;
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf') || fileType.includes('text')) return FileText;
    return File;
  };

  const getPreviewUrl = () => {
    if (attachment.file && attachment.file.type.startsWith('image/')) {
      return URL.createObjectURL(attachment.file);
    }
    return null;
  };

  const IconComponent = getFileIcon();
  const previewUrl = getPreviewUrl();

  if (attachment.status === 'processing') {
    return (
      <div className={`${sizeClasses[size]} bg-muted rounded-full flex items-center justify-center`}>
        <Loader2 className={`${iconSizes[size]} animate-spin text-muted-foreground`} />
      </div>
    );
  }

  if (attachment.status === 'error') {
    return (
      <div className={`${sizeClasses[size]} bg-destructive/10 rounded-full flex items-center justify-center`}>
        <AlertCircle className={`${iconSizes[size]} text-destructive`} />
      </div>
    );
  }

  if (previewUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-muted flex-shrink-0`}>
        <img 
          src={previewUrl} 
          alt={attachment.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-muted rounded-full flex items-center justify-center flex-shrink-0`}>
      <IconComponent className={`${iconSizes[size]} text-muted-foreground`} />
    </div>
  );
};
