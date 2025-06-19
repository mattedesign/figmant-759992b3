
import React, { useState } from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone, ExternalLink, AlertCircle, Loader2, Camera } from 'lucide-react';

interface ScreenshotDisplayProps {
  attachment: ChatAttachment;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({ attachment }) => {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  // Show loading state if attachment is still processing
  if (attachment.status === 'processing') {
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <Loader2 className="w-4 h-4 text-muted-foreground mx-auto mb-2 animate-spin" />
        <p className="text-xs text-muted-foreground">Capturing screenshots...</p>
      </div>
    );
  }

  if (!attachment.metadata?.screenshots) {
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <Camera className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">No screenshots available</p>
      </div>
    );
  }

  const { desktop, mobile } = attachment.metadata.screenshots;
  
  // Fixed: Use screenshotUrl instead of url for checking if screenshots are available
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
  
  // Fixed: Use screenshotUrl instead of url for displaying the image
  const currentScreenshotUrl = activeView === 'desktop' ? desktop?.screenshotUrl : mobile?.screenshotUrl;

  return (
    <div className="space-y-2">
      {/* View Toggle */}
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

      {/* Screenshot Display */}
      {currentScreenshotUrl ? (
        <div className="relative group">
          <img
            src={currentScreenshotUrl}
            alt={`${activeView} screenshot of ${attachment.url}`}
            className="w-full h-auto rounded-md border border-border/50 shadow-sm"
            onError={(e) => {
              console.error('Failed to load screenshot:', currentScreenshotUrl);
              e.currentTarget.classList.add('hidden');
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
                  {currentScreenshot.metadata.width}x{currentScreenshot.metadata.height}
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
            {activeView === 'desktop' ? 'Desktop' : 'Mobile'} screenshot not available
          </p>
          {currentScreenshot?.error && (
            <p className="text-xs text-destructive mt-1">{currentScreenshot.error}</p>
          )}
        </div>
      )}
    </div>
  );
};
