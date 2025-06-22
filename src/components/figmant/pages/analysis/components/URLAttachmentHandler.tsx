
import React from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface URLAttachmentHandlerProps {
  urlInput: string;
  setUrlInput: (url: string) => void;
  setShowUrlInput: (show: boolean) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[] | ((prev: ChatAttachment[]) => ChatAttachment[])) => void;
  children: (handleAddUrl: () => void) => React.ReactNode;
}

export const URLAttachmentHandler: React.FC<URLAttachmentHandlerProps> = ({
  urlInput,
  setUrlInput,
  setShowUrlInput,
  attachments,
  setAttachments,
  children
}) => {
  const { toast } = useToast();

  const handleAddUrl = async () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
      return;
    }

    console.log('🔗 URL ATTACHMENT HANDLER - Adding URL:', urlInput);

    // Validate URL format
    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      // Check if URL already exists
      const urlExists = attachments.some(att => att.url === formattedUrl);
      if (urlExists) {
        toast({
          variant: "destructive",
          title: "URL Already Added",
          description: `${hostname} is already in your attachments.`,
        });
        return;
      }

      // Check screenshot service status first
      const serviceStatus = await ScreenshotCaptureService.getServiceStatus();
      console.log('📸 Screenshot service status:', serviceStatus);

      // Create new URL attachment with processing status
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'processing',
        metadata: {
          screenshots: {
            desktop: { success: false, url: formattedUrl },
            mobile: { success: false, url: formattedUrl }
          }
        }
      };

      console.log('Creating new URL attachment:', newAttachment);
      setAttachments(prev => [...prev, newAttachment]);
      
      setUrlInput('');
      setShowUrlInput(false);
      
      // Show different messages based on service status
      if (!serviceStatus.isWorking) {
        toast({
          title: "Website Added",
          description: `${hostname} added. Using mock screenshots - analysis will continue.`,
        });
      } else {
        toast({
          title: "Website Added",
          description: `${hostname} added. Capturing screenshots...`,
        });
      }

      // Attempt screenshot capture - this should always work now (either real or mock)
      try {
        console.log('📸 Starting screenshot capture for:', formattedUrl);
        
        const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
          [formattedUrl],
          true, // include desktop
          true  // include mobile
        );

        console.log('📸 Screenshot capture results:', screenshotResults);

        // Update the attachment with screenshot data
        setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            const desktopResult = screenshotResults.desktop?.[0];
            const mobileResult = screenshotResults.mobile?.[0];
            
            return {
              ...att,
              status: 'uploaded',
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: {
                    success: desktopResult?.success || false,
                    url: formattedUrl,
                    screenshotUrl: desktopResult?.screenshotUrl,
                    thumbnailUrl: desktopResult?.thumbnailUrl,
                    error: desktopResult?.success === false ? 
                      (desktopResult?.error || 'Desktop screenshot failed') : undefined
                  },
                  mobile: {
                    success: mobileResult?.success || false,
                    url: formattedUrl,
                    screenshotUrl: mobileResult?.screenshotUrl,
                    thumbnailUrl: mobileResult?.thumbnailUrl,
                    error: mobileResult?.success === false ? 
                      (mobileResult?.error || 'Mobile screenshot failed') : undefined
                  }
                }
              }
            };
          }
          return att;
        }));

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          const screenshotType = serviceStatus.isWorking ? 'real' : 'mock';
          toast({
            title: "Screenshots Ready",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} ${screenshotType} screenshots for ${hostname}.`,
          });
        } else {
          // This shouldn't happen with mock provider, but just in case
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${hostname}. Website will still be analyzed.`,
          });
        }

      } catch (screenshotError) {
        console.error('📸 Screenshot capture error:', screenshotError);
        
        // Update attachment status to show error but keep it functional
        setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            return {
              ...att,
              status: 'uploaded', // Still functional for analysis
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: { 
                    success: false, 
                    url: formattedUrl, 
                    error: 'Screenshot service error - analysis will continue without images'
                  },
                  mobile: { 
                    success: false, 
                    url: formattedUrl, 
                    error: 'Screenshot service error - analysis will continue without images'
                  }
                }
              }
            };
          }
          return att;
        }));

        // Always show a helpful error message but don't block the user
        toast({
          title: "Screenshots Unavailable",
          description: `Could not capture screenshots for ${hostname}, but website analysis will continue without images.`,
        });
      }

    } catch (error) {
      console.error('URL validation error:', error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
    }
  };

  return <>{children(handleAddUrl)}</>;
};
