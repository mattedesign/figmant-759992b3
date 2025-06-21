
import React, { useState } from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ExternalLink, AlertCircle, Loader2, Camera } from 'lucide-react';

interface ScreenshotDisplayProps {
  attachment: ChatAttachment;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({ attachment }) => {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [imageLoadError, setImageLoadError] = useState<string | null>(null);

  // Show loading state if attachment is still processing
  if (attachment.status === 'processing') {
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <Loader2 className="w-4 h-4 text-muted-foreground mx-auto mb-2 animate-spin" />
        <p className="text-xs text-muted-foreground">Capturing screenshots...</p>
      </div>
    );
  }

  // Check if screenshots metadata exists
  if (!attachment.metadata?.screenshots) {
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <Camera className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">No screenshots available</p>
      </div>
    );
  }

  const { desktop, mobile } = attachment.metadata.screenshots;
  
  // Check if screenshots are available using the correct property (screenshotUrl)
  const hasDesktop = desktop?.success && desktop.screenshotUrl;
  const hasMobile = mobile?.success && mobile.screenshotUrl;

  if (!hasDesktop && !hasMobile) {
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <AlertCircle className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Screenshot capture failed</p>
        {(desktop?.error || mobile?.error) && (
          <p className="text-xs text-destructive mt-1">{desktop?.error || mobile?.error}</p>
        )}
      </div>
    );
  }

  const currentScreenshot = activeView === 'desktop' ? desktop : mobile;
  const currentScreenshotUrl = currentScreenshot?.screenshotUrl;

  return (
    <div className="space-y-2">
      {/* View Toggle - only show if both views are available */}
      {hasDesktop && hasMobile && (
        <div className="flex items-center gap-1">
          <Button
            variant={activeView === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('desktop')}
            className="h-6 px-2 text-xs"
          >
            <Monitor className="w-3 h-3 mr-1" />
            Desktop
          </Button>
          <Button
            variant={activeView === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('mobile')}
            className="h-6 px-2 text-xs"
          >
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </Button>
        </div>
      )}

      {/* Screenshot Display using background image to bypass CORS */}
      {currentScreenshotUrl && !imageLoadError ? (
        <div className="relative group">
          <div
            className="w-full min-h-[300px] rounded-md border border-border/50 shadow-sm bg-gray-100"
            style={{
              backgroundImage: `url(${currentScreenshotUrl})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              aspectRatio: activeView === 'desktop' ? '16/10' : '9/16'
            }}
            onLoad={() => setImageLoadError(null)}
            onError={() => {
              console.error('Failed to load screenshot:', currentScreenshotUrl);
              setImageLoadError(`Failed to load ${activeView} screenshot`);
            }}
          />
          
          {/* Overlay with details */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md">
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeView === 'desktop' ? 'Desktop' : 'Mobile'}
              </Badge>
              {currentScreenshot?.metadata && (
                <Badge variant="outline" className="text-xs">
                  {currentScreenshot.metadata.width}×{currentScreenshot.metadata.height}
                </Badge>
              )}
            </div>
            
            {attachment.url && (
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0 opacity-80 hover:opacity-100"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <AlertCircle className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            {imageLoadError || `${activeView === 'desktop' ? 'Desktop' : 'Mobile'} screenshot not available`}
          </p>
          {currentScreenshot?.error && (
            <p className="text-xs text-destructive mt-1">{currentScreenshot.error}</p>
          )}
        </div>
      )}
    </div>
  );
};
