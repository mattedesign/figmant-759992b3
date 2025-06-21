
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { ScreenshotServiceDebugger } from './ScreenshotServiceDebugger';

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
  const [showDebugger, setShowDebugger] = useState(false);
  const { toast } = useToast();

  // Handle escape key to close overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUrlInput) {
        onClose();
      }
    };

    if (showUrlInput) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showUrlInput, onClose]);

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

        // Transform the screenshot results to match what ScreenshotDisplay expects
        const updatedMetadata = {
          screenshots: {
            desktop: {
              success: screenshotResults.desktop?.[0]?.success || false,
              url: validation.formattedUrl,
              screenshotUrl: screenshotResults.desktop?.[0]?.screenshotUrl,
              error: screenshotResults.desktop?.[0]?.success === false ? 
                (screenshotResults.desktop?.[0]?.error || 'Desktop screenshot failed') : undefined
            },
            mobile: {
              success: screenshotResults.mobile?.[0]?.success || false,
              url: validation.formattedUrl,
              screenshotUrl: screenshotResults.mobile?.[0]?.screenshotUrl,
              error: screenshotResults.mobile?.[0]?.success === false ? 
                (screenshotResults.mobile?.[0]?.error || 'Mobile screenshot failed') : undefined
            }
          }
        };

        console.log('📸 Updating attachment with metadata:', updatedMetadata);

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
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validation = validateUrl(urlInput);
  const canAdd = validation.isValid && !isValidating;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      />
      
      {/* Overlay Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-200">
        <Card className="p-6 border bg-background shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">Add Website URL</span>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
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
                  autoFocus
                />
                <Button 
                  onClick={handleAddUrl} 
                  disabled={!canAdd}
                  size="sm"
                  className={canAdd ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
              
              {/* Status badges */}
              <div className="flex items-center gap-2">
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
              
              {/* Validation messages */}
              {validationError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </p>
              )}
              
              {urlInput && validation.isValid && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Ready to add: {validation.hostname}
                </p>
              )}
            </div>

            {/* Debug toggle */}
            <div className="flex justify-between items-center pt-2 border-t">
              <Button
                onClick={() => setShowDebugger(!showDebugger)}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
              >
                {showDebugger ? 'Hide' : 'Show'} Debug Info
              </Button>
              <div className="text-xs text-gray-400">
                Press Escape to close
              </div>
            </div>

            {/* Service Debugger */}
            {showDebugger && (
              <div className="border-t pt-4">
                <ScreenshotServiceDebugger />
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};
