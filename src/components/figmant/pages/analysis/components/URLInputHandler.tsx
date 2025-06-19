
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

interface URLInputHandlerProps {
  showUrlInput: boolean;
  onClose: () => void;
  attachments: ChatAttachment[];
  onAttachmentAdd: (attachment: ChatAttachment) => void;
  onAttachmentUpdate: (id: string, updates: Partial<ChatAttachment>) => void;
}

export const URLInputHandler: React.FC<URLInputHandlerProps> = ({
  showUrlInput,
  onClose,
  attachments,
  onAttachmentAdd,
  onAttachmentUpdate
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  if (!showUrlInput) return null;

  const validateUrl = (url: string): { isValid: boolean; formattedUrl: string; hostname: string; error?: string } => {
    if (!url.trim()) {
      return { isValid: false, formattedUrl: '', hostname: '', error: 'URL cannot be empty' };
    }

    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      // Check if URL already exists
      const urlExists = attachments.some(att => att.url === formattedUrl);
      if (urlExists) {
        return { isValid: false, formattedUrl, hostname, error: `${hostname} is already added` };
      }

      return { isValid: true, formattedUrl, hostname };
    } catch {
      return { isValid: false, formattedUrl: url, hostname: '', error: 'Invalid URL format' };
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    setValidationError(null);
  };

  const handleAddUrl = async () => {
    console.log('🔗 URL INPUT HANDLER - Adding URL:', urlInput);
    
    const validation = validateUrl(urlInput);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid URL');
      console.log('🔗 URL validation failed:', validation.error);
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      // Create attachment immediately for UI feedback
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: validation.hostname,
        url: validation.formattedUrl,
        status: 'processing',
        metadata: {
          screenshots: {
            desktop: { success: false, url: validation.formattedUrl },
            mobile: { success: false, url: validation.formattedUrl }
          }
        }
      };

      console.log('🔗 Creating new URL attachment:', newAttachment);
      onAttachmentAdd(newAttachment);

      // Clear input and close
      setUrlInput('');
      onClose();
      setIsValidating(false);

      toast({
        title: "Website Added",
        description: `${validation.hostname} added. Capturing screenshots...`,
      });

      // Capture screenshots in background
      try {
        console.log('📸 Starting screenshot capture for:', validation.formattedUrl);
        
        const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
          [validation.formattedUrl],
          true, // desktop
          true  // mobile
        );

        console.log('📸 Screenshot results:', screenshotResults);

        // Update attachment with results
        const updatedMetadata = {
          screenshots: {
            desktop: screenshotResults.desktop?.[0] || { 
              success: false, 
              url: validation.formattedUrl, 
              error: 'Desktop screenshot failed' 
            },
            mobile: screenshotResults.mobile?.[0] || { 
              success: false, 
              url: validation.formattedUrl, 
              error: 'Mobile screenshot failed' 
            }
          }
        };

        onAttachmentUpdate(newAttachment.id, {
          status: 'uploaded',
          metadata: updatedMetadata
        });

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          toast({
            title: "Screenshots Captured",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${validation.hostname}. The website will still be analyzed.`,
          });
        }

      } catch (screenshotError) {
        console.error('📸 Screenshot capture error:', screenshotError);
        
        onAttachmentUpdate(newAttachment.id, {
          status: 'uploaded',
          metadata: {
            screenshots: {
              desktop: { success: false, url: validation.formattedUrl, error: 'Screenshot service unavailable' },
              mobile: { success: false, url: validation.formattedUrl, error: 'Screenshot service unavailable' }
            }
          }
        });

        toast({
          variant: "destructive",
          title: "Screenshot Capture Failed",
          description: `Screenshots unavailable for ${validation.hostname}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('🔗 URL add error:', error);
      setValidationError('Failed to add URL. Please try again.');
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating) {
      e.preventDefault();
      handleAddUrl();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const validation = validateUrl(urlInput);
  const canAdd = validation.isValid && !isValidating;

  return (
    <Card className="p-4 border bg-background animate-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Add Website URL</span>
          {validation.isValid && urlInput && (
            <Badge variant="secondary" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          )}
          {validationError && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com or example.com"
            onKeyDown={handleKeyPress}
            disabled={isValidating}
            className={`${
              validation.isValid && urlInput ? 'border-green-300 focus:border-green-500' : 
              validationError ? 'border-red-300 focus:border-red-500' : ''
            }`}
          />
          <Button 
            onClick={handleAddUrl} 
            disabled={!canAdd}
            loading={isValidating}
            size="sm"
            className={canAdd ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isValidating ? 'Adding...' : 'Add'}
          </Button>
        </div>
        
        {validationError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationError}
          </p>
        )}
        
        {urlInput && validation.isValid && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Ready to add: {validation.hostname}
          </p>
        )}
      </div>
    </Card>
  );
};
