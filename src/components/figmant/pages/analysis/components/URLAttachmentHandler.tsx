
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

      console.log('Creating new URL attachment with screenshot capture:', newAttachment);
      setAttachments(prev => [...prev, newAttachment]);
      
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "Website Added",
        description: `${hostname} has been added. Capturing screenshots...`,
      });

      // Capture screenshots in the background
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
            return {
              ...att,
              status: 'uploaded',
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: screenshotResults.desktop?.[0] || { success: false, url: formattedUrl, error: 'Desktop screenshot failed' },
                  mobile: screenshotResults.mobile?.[0] || { success: false, url: formattedUrl, error: 'Mobile screenshot failed' }
                }
              }
            };
          }
          return att;
        }));

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          toast({
            title: "Screenshots Captured",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots for ${hostname}.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
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
                  desktop: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' },
                  mobile: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' }
                }
              }
            };
          }
          return att;
        }));

        toast({
          variant: "destructive",
          title: "Screenshot Capture Failed",
          description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
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
