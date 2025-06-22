
import React from 'react';
import { Globe, Image as ImageIcon, AlertTriangle, Camera, Zap } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { EnhancedImage } from './EnhancedImage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageService } from '@/services/imageService';

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
  
  const desktopUrl = hasDesktopScreenshot ? attachment.metadata.screenshots.desktop.screenshotUrl || attachment.metadata.screenshots.desktop.thumbnailUrl || attachment.metadata.screenshots.desktop.url : null;
  const mobileUrl = hasMobileScreenshot ? attachment.metadata.screenshots.mobile.screenshotUrl || attachment.metadata.screenshots.mobile.thumbnailUrl || attachment.metadata.screenshots.mobile.url : null;

  // Check if we're using ScreenshotOne URLs
  const isDesktopScreenshotOne = desktopUrl ? ImageService.isScreenshotOneUrl(desktopUrl) : false;
  const isMobileScreenshotOne = mobileUrl ? ImageService.isScreenshotOneUrl(mobileUrl) : false;
  const isUsingScreenshotOne = isDesktopScreenshotOne || isMobileScreenshotOne;

  // Get error messages if screenshots failed
  const desktopError = attachment.metadata?.screenshots?.desktop?.error;
  const mobileError = attachment.metadata?.screenshots?.mobile?.error;
  const hasScreenshotErrors = desktopError || mobileError;

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
            {isUsingScreenshotOne && (
              <div className="flex items-center gap-1 text-xs bg-blue-500/20 px-2 py-1 rounded">
                <Zap className="w-3 h-3" />
                Real
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show error state for URL attachments when screenshots failed
  if (attachment.type === 'url') {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="relative">
              <Globe className="w-8 h-8 text-gray-400" />
              {hasScreenshotErrors && (
                <div className="absolute -top-1 -right-1 bg-yellow-100 rounded-full p-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                </div>
              )}
            </div>
          </div>
          
          <p className="text-sm font-medium text-gray-700 mb-1">{attachment.name}</p>
          
          {hasScreenshotErrors ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Screenshot capture failed</p>
              {(desktopError || mobileError) && (
                <Alert className="text-left">
                  <AlertTriangle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {desktopError || mobileError}
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-blue-600">Website will still be analyzed</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <Camera className="w-3 h-3" />
                <span>Processing screenshot...</span>
              </div>
            </div>
          )}
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
