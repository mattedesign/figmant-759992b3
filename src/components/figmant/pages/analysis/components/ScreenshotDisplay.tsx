
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
  // Check if we have screenshot data in metadata
  const hasDesktopScreenshot = attachment.metadata?.screenshots?.desktop?.success;
  const hasMobileScreenshot = attachment.metadata?.screenshots?.mobile?.success;
  
  const desktopUrl = hasDesktopScreenshot ? attachment.metadata.screenshots.desktop.thumbnailUrl || attachment.metadata.screenshots.desktop.url : null;
  const mobileUrl = hasMobileScreenshot ? attachment.metadata.screenshots.mobile.thumbnailUrl || attachment.metadata.screenshots.mobile.url : null;

  // If we have screenshots, show them
  if (hasDesktopScreenshot || hasMobileScreenshot) {
    return (
      <div className={`relative ${className}`}>
        {hasDesktopScreenshot && desktopUrl ? (
          <EnhancedImage
            attachment={{ ...attachment, url: desktopUrl, thumbnailUrl: desktopUrl }}
            className="w-full h-full"
            alt={`Desktop screenshot of ${attachment.name}`}
          />
        ) : hasMobileScreenshot && mobileUrl ? (
          <EnhancedImage
            attachment={{ ...attachment, url: mobileUrl, thumbnailUrl: mobileUrl }}
            className="w-full h-full"
            alt={`Mobile screenshot of ${attachment.name}`}
          />
        ) : null}
        
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
