
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ExternalLink, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

interface ScreenshotDisplayProps {
  attachment: ChatAttachment;
  showBothViews?: boolean;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({
  attachment,
  showBothViews = false
}) => {
  const screenshots = attachment.metadata?.screenshots;
  
  if (!screenshots) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ExternalLink className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">No screenshot available</p>
        </div>
      </div>
    );
  }

  const desktop = screenshots.desktop;
  const mobile = screenshots.mobile;

  if (showBothViews) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Desktop View */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium">Desktop</span>
            {desktop?.success ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>
          {desktop?.success && desktop.screenshotUrl ? (
            <img
              src={desktop.screenshotUrl}
              alt={`Desktop view of ${attachment.name}`}
              className="w-full h-48 object-cover rounded border"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
              <p className="text-xs text-gray-500 text-center">
                {desktop?.error || 'Screenshot failed'}
              </p>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">Mobile</span>
            {mobile?.success ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>
          {mobile?.success && mobile.screenshotUrl ? (
            <img
              src={mobile.screenshotUrl}
              alt={`Mobile view of ${attachment.name}`}
              className="w-full h-48 object-cover rounded border"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded border flex items-center justify-center">
              <p className="text-xs text-gray-500 text-center">
                {mobile?.error || 'Screenshot failed'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Single view - prefer desktop, fallback to mobile
  const primaryScreenshot = desktop?.success ? desktop : mobile?.success ? mobile : desktop;
  
  if (attachment.status === 'processing') {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500">Capturing screenshot...</p>
        </div>
      </div>
    );
  }

  if (primaryScreenshot?.success && primaryScreenshot.screenshotUrl) {
    return (
      <div className="w-full h-full relative group">
        <img
          src={primaryScreenshot.screenshotUrl}
          alt={`Screenshot of ${attachment.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => window.open(attachment.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit Site
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Screenshot failed</p>
        <p className="text-xs text-gray-400 mt-1">
          {primaryScreenshot?.error || 'Unable to capture website'}
        </p>
      </div>
    </div>
  );
};
