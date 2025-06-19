
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
  const [imageError, setImageError] = useState<string | null>(null);

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
    console.error('🚨 SCREENSHOT DISPLAY - No screenshots metadata found:', attachment);
    return (
      <div className="p-3 bg-muted/50 rounded-lg text-center">
        <Camera className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">No screenshots available</p>
      </div>
    );
  }

  const { desktop, mobile } = attachment.metadata.screenshots;
  
  // Log the screenshot data for debugging
  console.log('🔍 SCREENSHOT DISPLAY - Desktop data:', desktop);
  console.log('🔍 SCREENSHOT DISPLAY - Mobile data:', mobile);
  
  const hasDesktop = desktop?.success && desktop.screenshotUrl;
  const hasMobile = mobile?.success && mobile.screenshotUrl;

  if (!hasDesktop && !hasMobile) {
    console.error('🚨 SCREENSHOT DISPLAY - No valid screenshots found:', { desktop, mobile });
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

  console.log('🖼️ SCREENSHOT DISPLAY - Current screenshot URL:', currentScreenshotUrl);
  console.log('🖼️ SCREENSHOT DISPLAY - Current screenshot data:', currentScreenshot);

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
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <img 
                src={currentScreenshotUrl}
                alt={`${activeView} screenshot of ${attachment.name}`}
                className="w-full h-auto max-h-48 object-cover"
                style={{ aspectRatio: activeView === 'desktop' ? '16/10' : '9/16' }}
                onError={(e) => {
                  const errorMsg = `Failed to load ${activeView} screenshot`;
                  console.error('🚨 SCREENSHOT IMAGE ERROR:', {
                    url: currentScreenshotUrl,
                    screenshot: currentScreenshot,
                    attachment: attachment,
                    error: errorMsg
                  });
                  setImageError(errorMsg);
                }}
                onLoad={() => {
                  console.log('✅ SCREENSHOT IMAGE LOADED:', currentScreenshotUrl);
                  setImageError(null);
                }}
              />
              
              {/* Overlay with link */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="h-6 px-2 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Visit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <AlertCircle className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            {activeView === 'desktop' ? 'Desktop' : 'Mobile'} screenshot unavailable
          </p>
          {currentScreenshot?.error && (
            <p className="text-xs text-destructive mt-1">{currentScreenshot.error}</p>
          )}
        </div>
      )}

      {/* Error Display */}
      {imageError && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
          <p className="text-xs text-red-600">{imageError}</p>
          <p className="text-xs text-red-500 mt-1 font-mono break-all">{currentScreenshotUrl}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <Badge 
          variant={attachment.status === 'uploaded' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {attachment.status}
        </Badge>
        
        {attachment.url && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(attachment.url, '_blank')}
            className="h-5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};
