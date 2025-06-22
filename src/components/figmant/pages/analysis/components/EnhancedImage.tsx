
import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle, Camera } from 'lucide-react';
import { ImageService } from '@/services/imageService';

interface EnhancedImageProps {
  attachment: any;
  className?: string;
  alt?: string;
  onClick?: () => void;
  showFallback?: boolean;
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  attachment,
  className = '',
  alt,
  onClick,
  showFallback = true
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScreenshotOneUrl, setIsScreenshotOneUrl] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!attachment) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasError(false);
      
      try {
        console.log('🖼️ ENHANCED IMAGE - Loading attachment:', {
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
          file_path: attachment.file_path,
          path: attachment.path,
          thumbnailUrl: attachment.thumbnailUrl
        });

        // Use the enhanced resolution method for analysis attachments
        const url = ImageService.resolveAnalysisAttachmentUrl(attachment);
        
        if (url) {
          console.log('🖼️ ENHANCED IMAGE - Resolved URL:', url);
          
          // Check if it's a ScreenshotOne URL
          const isScreenshotOne = ImageService.isScreenshotOneUrl(url);
          setIsScreenshotOneUrl(isScreenshotOne);
          
          if (isScreenshotOne) {
            // For ScreenshotOne URLs, set them directly without validation
            // The browser will handle the loading and we'll catch errors in onError
            console.log('🖼️ ENHANCED IMAGE - ScreenshotOne URL detected, using directly');
            setImageUrl(url);
            setIsLoading(false);
            return;
          }
          
          // For non-ScreenshotOne URLs, validate before setting
          const isValid = await ImageService.validateImageUrl(url);
          if (isValid) {
            setImageUrl(url);
            setIsLoading(false);
            return;
          } else {
            console.log('🖼️ ENHANCED IMAGE - URL validation failed:', url);
          }
        }

        // If resolution failed, try the fallback method
        const fallbackUrl = await ImageService.getBestImageUrl(attachment);
        if (fallbackUrl) {
          console.log('🖼️ ENHANCED IMAGE - Using fallback URL:', fallbackUrl);
          setImageUrl(fallbackUrl);
          setIsScreenshotOneUrl(ImageService.isScreenshotOneUrl(fallbackUrl));
        } else {
          console.log('🖼️ ENHANCED IMAGE - No valid URL found');
          setHasError(true);
        }
      } catch (error) {
        console.error('🖼️ ENHANCED IMAGE - Error loading image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [attachment]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('🖼️ ENHANCED IMAGE - Image load error for URL:', imageUrl);
    console.log('🖼️ ENHANCED IMAGE - Error details:', {
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      complete: target.complete
    });
    
    // For ScreenshotOne URLs, this might be expected during loading
    if (isScreenshotOneUrl) {
      console.log('🖼️ ENHANCED IMAGE - ScreenshotOne URL failed to load, this might be normal');
    }
    
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('🖼️ ENHANCED IMAGE - Image loaded successfully:', imageUrl);
    console.log('🖼️ ENHANCED IMAGE - Image dimensions:', {
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight
    });
    setIsLoading(false);
    setHasError(false);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    if (!showFallback) return null;
    
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} onClick={onClick}>
        <div className="text-center text-gray-500">
          {isScreenshotOneUrl ? (
            <Camera className="h-6 w-6 mx-auto mb-1" />
          ) : hasError ? (
            <AlertCircle className="h-6 w-6 mx-auto mb-1" />
          ) : (
            <ImageIcon className="h-6 w-6 mx-auto mb-1" />
          )}
          <span className="text-xs">
            {isScreenshotOneUrl ? 'Screenshot loading...' : hasError ? 'Failed to load' : 'No image'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || attachment.name || 'Attachment'}
      className={`object-cover ${className}`}
      onClick={onClick}
      onError={handleImageError}
      onLoad={handleImageLoad}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      // For ScreenshotOne URLs, add crossorigin attribute to handle CORS properly
      crossOrigin={isScreenshotOneUrl ? 'anonymous' : undefined}
    />
  );
};
