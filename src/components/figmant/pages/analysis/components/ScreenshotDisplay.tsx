
import React from 'react';
import { Globe, Image as ImageIcon } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { EnhancedImage } from './EnhancedImage';

interface ScreenshotDisplayProps {
  attachment: ChatAttachment;
  className?: string;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({
  attachment,
  className = ''
}) => {
  console.log('🖼️ SCREENSHOT DISPLAY - Rendering attachment:', {
    id: attachment.id,
    name: attachment.name,
    type: attachment.type,
    url: attachment.url,
    screenshotUrl: attachment.screenshotUrl,
    thumbnailUrl: attachment.thumbnailUrl,
    metadata: attachment.metadata
  });

  // Check for direct screenshot URLs first (easier access)
  if (attachment.screenshotUrl || attachment.thumbnailUrl) {
    const imageUrl = attachment.thumbnailUrl || attachment.screenshotUrl;
    console.log('🖼️ SCREENSHOT DISPLAY - Using direct screenshot URL:', imageUrl);
    
    return (
      <div className={`relative ${className}`}>
        <EnhancedImage
          attachment={{ ...attachment, url: imageUrl, thumbnailUrl: imageUrl }}
          className="w-full h-full"
          alt={`Screenshot of ${attachment.name}`}
        />
        
        {/* Overlay with website info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-2 text-white text-sm">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{attachment.name}</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have screenshot data in metadata
  const hasDesktopScreenshot = attachment.metadata?.screenshots?.desktop?.success;
  const hasMobileScreenshot = attachment.metadata?.screenshots?.mobile?.success;
  
  const desktopUrl = hasDesktopScreenshot ? attachment.metadata.screenshots.desktop.thumbnailUrl || attachment.metadata.screenshots.desktop.screenshotUrl : null;
  const mobileUrl = hasMobileScreenshot ? attachment.metadata.screenshots.mobile.thumbnailUrl || attachment.metadata.screenshots.mobile.screenshotUrl : null;

  console.log('🖼️ SCREENSHOT DISPLAY - Checking metadata screenshots:', {
    hasDesktopScreenshot,
    hasMobileScreenshot,
    desktopUrl,
    mobileUrl
  });

  // If we have screenshots in metadata, show them
  if (hasDesktopScreenshot || hasMobileScreenshot) {
    const preferredUrl = desktopUrl || mobileUrl;
    console.log('🖼️ SCREENSHOT DISPLAY - Using metadata screenshot URL:', preferredUrl);
    
    return (
      <div className={`relative ${className}`}>
        {preferredUrl ? (
          <EnhancedImage
            attachment={{ ...attachment, url: preferredUrl, thumbnailUrl: preferredUrl }}
            className="w-full h-full"
            alt={`Screenshot of ${attachment.name}`}
          />
        ) : (
          <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${className}`}>
            <div className="text-center text-gray-600">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">{attachment.name}</p>
              <p className="text-xs text-gray-500 mt-1">Screenshot Processing...</p>
            </div>
          </div>
        )}
        
        {/* Overlay with website info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-2 text-white text-sm">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{attachment.name}</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for URL attachments without screenshots
  console.log('🖼️ SCREENSHOT DISPLAY - No screenshots found, showing fallback');
  
  if (attachment.type === 'url') {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-sm font-medium">{attachment.name}</p>
          <p className="text-xs text-gray-500 mt-1">Website Link</p>
        </div>
      </div>
    );
  }

  // For other attachment types, try to show as image
  return (
    <EnhancedImage
      attachment={attachment}
      className={`w-full h-full ${className}`}
      showFallback={true}
    />
  );
};
