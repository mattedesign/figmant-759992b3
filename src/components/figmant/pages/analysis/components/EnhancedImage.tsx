
import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const url = await ImageService.getBestImageUrl(attachment);
        if (url) {
          setImageUrl(url);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (attachment) {
      loadImage();
    }
  }, [attachment]);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
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
          {hasError ? (
            <AlertCircle className="h-6 w-6 mx-auto mb-1" />
          ) : (
            <ImageIcon className="h-6 w-6 mx-auto mb-1" />
          )}
          <span className="text-xs">
            {hasError ? 'Failed to load' : 'No image'}
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
    />
  );
};
