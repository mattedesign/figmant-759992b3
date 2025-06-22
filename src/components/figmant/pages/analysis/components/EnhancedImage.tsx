
import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle, Camera, RefreshCw } from 'lucide-react';
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
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const loadImage = async () => {
      if (!attachment) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setLoadAttempts(0);
      
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
            // For ScreenshotOne URLs, set them directly
            // The browser will handle loading and we'll catch errors in onError
            console.log('🖼️ ENHANCED IMAGE - Using ScreenshotOne URL directly');
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
    const currentAttempts = loadAttempts + 1;
    setLoadAttempts(currentAttempts);
    
    console.log('🖼️ ENHANCED IMAGE - Image load error (attempt ' + currentAttempts + '):', {
      url: imageUrl,
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      complete: target.complete,
      isScreenshotOne: isScreenshotOneUrl
    });
    
    // For ScreenshotOne URLs, give them more attempts as they might need time to generate
    if (isScreenshotOneUrl && currentAttempts < 3) {
      console.log('🖼️ ENHANCED IMAGE - Retrying ScreenshotOne URL in 2 seconds...');
      setTimeout(() => {
        // Force reload by adding a timestamp parameter
        if (imageUrl) {
          const separator = imageUrl.includes('?') ? '&' : '?';
          const retryUrl = `${imageUrl}${separator}_retry=${Date.now()}`;
          setImageUrl(retryUrl);
        }
      }, 2000);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log('🖼️ ENHANCED IMAGE - Image loaded successfully:', {
      url: imageUrl,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      isScreenshotOne: isScreenshotOneUrl
    });
    setIsLoading(false);
    setHasError(false);
    setLoadAttempts(0);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          {isScreenshotOneUrl && (
            <div className="text-xs text-gray-500">Generating screenshot...</div>
          )}
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    if (!showFallback) return null;
    
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} onClick={onClick}>
        <div className="text-center text-gray-500">
          {isScreenshotOneUrl ? (
            <>
              <Camera className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">
                {loadAttempts > 0 ? 'Screenshot generation failed' : 'Screenshot loading...'}
              </span>
            </>
          ) : hasError ? (
            <>
              <AlertCircle className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">Failed to load</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-xs">No image</span>
            </>
          )}
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
