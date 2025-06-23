
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, File, FileText, Image as ImageIcon, Globe, X, Loader2, Check, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { StepProps } from '../types';
import { ScreenshotDisplay } from '@/components/figmant/pages/analysis/components/ScreenshotDisplay';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

// Compact File Preview Component
const CompactFilePreview: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
}> = ({ attachment, onDelete }) => {
  const getFileIcon = () => {
    if (!attachment.file) return File;
    const fileType = attachment.file.type;
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.includes('pdf')) return FileText;
    return File;
  };

  const getFileSize = () => {
    if (attachment.file?.size) {
      const size = attachment.file.size;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`;
      return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    }
    return '';
  };

  const IconComponent = getFileIcon();

  return (
    <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
      {/* File Icon/Preview */}
      {attachment.file?.type.startsWith('image/') ? (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={URL.createObjectURL(attachment.file)} 
            alt={attachment.name}
            className="w-full h-full object-cover"
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
        </div>
      ) : (
        <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-blue-600" />
        </div>
      )}
      
      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.name}
        </p>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {getFileSize() && <span>{getFileSize()}</span>}
          {attachment.status === 'processing' && (
            <span className="flex items-center space-x-1 text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Processing...</span>
            </span>
          )}
          {attachment.status === 'uploaded' && (
            <span className="flex items-center space-x-1 text-green-600">
              <Check className="w-3 h-3" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>
      
      {/* Single Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Compact URL Preview Component
const CompactUrlPreview: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
  onRetry: () => void;
}> = ({ attachment, onDelete, onRetry }) => {
  const hostname = attachment.url ? new URL(attachment.url).hostname : '';
  const screenshots = attachment.metadata?.screenshots;
  
  const hasDesktop = screenshots?.desktop?.success;
  const hasMobile = screenshots?.mobile?.success;
  const hasAnyScreenshot = hasDesktop || hasMobile;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors group">
      <div className="flex items-center space-x-3 p-3">
        {/* Website Icon/Screenshot */}
        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
          {hasDesktop && screenshots?.desktop?.screenshotUrl ? (
            <img 
              src={screenshots.desktop.screenshotUrl} 
              alt={hostname}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <Globe className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        {/* URL Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {hostname}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {attachment.status === 'processing' && (
              <span className="flex items-center space-x-1 text-blue-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Capturing screenshots...</span>
              </span>
            )}
            {hasAnyScreenshot && (
              <span className="flex items-center space-x-1 text-green-600">
                <Check className="w-3 h-3" />
                <span>{hasDesktop && hasMobile ? 'Desktop & Mobile' : hasDesktop ? 'Desktop' : 'Mobile'}</span>
              </span>
            )}
            {attachment.status === 'error' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-auto p-0 text-blue-600 hover:text-blue-700 text-xs"
              >
                Retry Screenshots
              </Button>
            )}
          </div>
        </div>
        
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const Step2SmartUpload: React.FC<StepProps> = ({
  stepData,
  setStepData,
  currentStep,
  totalSteps,
  onNextStep,
  onPreviousStep
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = [...currentFiles, ...files];
    
    // Create file attachments with proper ChatAttachment interface structure
    const newAttachments: ChatAttachment[] = files.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      type: 'file' as const,
      name: file.name,
      file: file,
      status: 'uploaded' as const,
      ...(file.type.startsWith('image/') && {
        thumbnailUrl: URL.createObjectURL(file)
      })
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Also update the uploads structure for backward compatibility
    const currentUploads = stepData.uploads || { images: [], urls: [], files: [], screenshots: [] };
    const newUploads = { ...currentUploads };
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newUploads.images = [...newUploads.images, file];
      } else {
        newUploads.files = [...newUploads.files, file];
      }
    });
    
    setStepData(prev => ({ 
      ...prev, 
      uploadedFiles: newFiles,
      uploads: newUploads
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleAddUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
      });
      return;
    }

    // Create URL attachment with proper ChatAttachment interface structure
    const urlAttachment: ChatAttachment = {
      id: `url-${Date.now()}-${Math.random()}`,
      type: 'url',
      name: new URL(url).hostname,
      url: url,
      status: 'processing',
      metadata: {
        screenshots: {
          desktop: { success: false, url },
          mobile: { success: false, url }
        }
      }
    };

    setAttachments(prev => [...prev, urlAttachment]);
    setUrlInput(''); // Clear input after adding

    toast({
      title: "Capturing Screenshots",
      description: `Starting screenshot capture for ${urlAttachment.name}...`,
    });

    // Capture screenshots
    try {
      const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
        [url],
        true, // desktop
        true  // mobile
      );

      const updatedMetadata = {
        screenshots: {
          desktop: {
            success: screenshotResults.desktop?.[0]?.success || false,
            url: url,
            screenshotUrl: screenshotResults.desktop?.[0]?.screenshotUrl,
            thumbnailUrl: screenshotResults.desktop?.[0]?.thumbnailUrl,
            error: screenshotResults.desktop?.[0]?.success === false ? 
              (screenshotResults.desktop?.[0]?.error || 'Desktop screenshot failed') : undefined
          },
          mobile: {
            success: screenshotResults.mobile?.[0]?.success || false,
            url: url,
            screenshotUrl: screenshotResults.mobile?.[0]?.screenshotUrl,
            thumbnailUrl: screenshotResults.mobile?.[0]?.thumbnailUrl,
            error: screenshotResults.mobile?.[0]?.success === false ? 
              (screenshotResults.mobile?.[0]?.error || 'Mobile screenshot failed') : undefined
          }
        }
      };

      setAttachments(prev => prev.map(att => 
        att.id === urlAttachment.id 
          ? { ...att, status: 'uploaded' as const, metadata: updatedMetadata }
          : att
      ));

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
          title: "Screenshot Failed",
          description: `Unable to capture screenshots for ${urlAttachment.name}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('📸 Screenshot capture error:', error);
      
      setAttachments(prev => prev.map(att => 
        att.id === urlAttachment.id 
          ? { 
              ...att, 
              status: 'error' as const, 
              errorMessage: 'Screenshot capture failed',
              metadata: {
                screenshots: {
                  desktop: { success: false, url, error: 'Capture failed' },
                  mobile: { success: false, url, error: 'Capture failed' }
                }
              }
            }
          : att
      ));

      toast({
        variant: "destructive",
        title: "Screenshot Failed",
        description: `Unable to capture screenshots for ${urlAttachment.name}. The website will still be analyzed.`,
      });
    }
  };

  const handleRetryScreenshot = async (attachment: ChatAttachment) => {
    if (attachment.type !== 'url' || !attachment.url) return;
    
    // Update status to processing
    setAttachments(prev => prev.map(att => 
      att.id === attachment.id 
        ? { 
            ...att,
            status: 'processing' as const,
            metadata: {
              ...attachment.metadata,
              screenshots: {
                desktop: { success: false, url: attachment.url },
                mobile: { success: false, url: attachment.url }
              }
            }
          }
        : att
    ));
    
    toast({
      title: "Retrying Screenshot",
      description: `Capturing new screenshots for ${new URL(attachment.url).hostname}...`,
    });
    
    try {
      const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
        [attachment.url],
        true, // desktop
        true  // mobile
      );
      
      const updatedMetadata = {
        screenshots: {
          desktop: {
            success: screenshotResults.desktop?.[0]?.success || false,
            url: attachment.url,
            screenshotUrl: screenshotResults.desktop?.[0]?.screenshotUrl,
            thumbnailUrl: screenshotResults.desktop?.[0]?.thumbnailUrl,
            error: screenshotResults.desktop?.[0]?.success === false ? 
              (screenshotResults.desktop?.[0]?.error || 'Desktop screenshot failed') : undefined
          },
          mobile: {
            success: screenshotResults.mobile?.[0]?.success || false,
            url: attachment.url,
            screenshotUrl: screenshotResults.mobile?.[0]?.screenshotUrl,
            thumbnailUrl: screenshotResults.mobile?.[0]?.thumbnailUrl,
            error: screenshotResults.mobile?.[0]?.success === false ? 
              (screenshotResults.mobile?.[0]?.error || 'Mobile screenshot failed') : undefined
          }
        }
      };
      
      setAttachments(prev => prev.map(att => 
        att.id === attachment.id 
          ? { ...att, status: 'uploaded' as const, metadata: updatedMetadata }
          : att
      ));
      
      const desktopSuccess = screenshotResults.desktop?.[0]?.success;
      const mobileSuccess = screenshotResults.mobile?.[0]?.success;
      
      if (desktopSuccess || mobileSuccess) {
        toast({
          title: "Screenshots Updated",
          description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Retry Failed",
          description: `Still unable to capture screenshots for ${new URL(attachment.url).hostname}.`,
        });
      }
      
    } catch (error) {
      console.error('🔄 Screenshot retry error:', error);
      
      setAttachments(prev => prev.map(att => 
        att.id === attachment.id 
          ? { 
              ...att,
              status: 'error' as const,
              errorMessage: 'Screenshot retry failed',
              metadata: {
                ...attachment.metadata,
                screenshots: {
                  desktop: { success: false, url: attachment.url, error: 'Retry failed' },
                  mobile: { success: false, url: attachment.url, error: 'Retry failed' }
                }
              }
            }
          : att
      ));
      
      toast({
        variant: "destructive",
        title: "Retry Failed",
        description: `Unable to capture screenshots. The website will still be analyzed.`,
      });
    }
  };

  const handleAttachmentRemove = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Upload Your Content</h2>
        <p className="text-center text-gray-600 mb-8">
          Add screenshots, designs, competitor URLs, or documents for analysis (optional)
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.txt,.json,.fig"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* IMPROVED LAYOUT - Upload Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
            
            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={handleChooseFiles}
            >
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            
            {/* Inline File Previews */}
            {attachments.filter(att => att.type === 'file').length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Files ({attachments.filter(att => att.type === 'file').length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachments
                    .filter(att => att.type === 'file')
                    .map((attachment) => (
                      <CompactFilePreview
                        key={attachment.id}
                        attachment={attachment}
                        onDelete={() => handleAttachmentRemove(attachment.id)}
                      />
                    ))
                  }
                </div>
              </div>
            )}
          </div>
          
          {/* URL Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Websites</h3>
            
            {/* URL Input */}
            <div className="space-y-3">
              <Input
                placeholder="Enter website URL (e.g., competitor.com)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
              />
              <Button 
                onClick={handleAddUrl} 
                disabled={!urlInput.trim()}
                className="w-full"
              >
                Add Website
              </Button>
            </div>
            
            {/* Inline URL Previews */}
            {attachments.filter(att => att.type === 'url').length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Websites ({attachments.filter(att => att.type === 'url').length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachments
                    .filter(att => att.type === 'url')
                    .map((attachment) => (
                      <CompactUrlPreview
                        key={attachment.id}
                        attachment={attachment}
                        onDelete={() => handleAttachmentRemove(attachment.id)}
                        onRetry={() => handleRetryScreenshot(attachment)}
                      />
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Summary Section - Only show if items exist */}
        {attachments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-900">
                  Ready for Analysis
                </span>
              </div>
              <span className="text-sm text-blue-700">
                {attachments.length} item{attachments.length !== 1 ? 's' : ''} added
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Your files and websites are ready for AI analysis in the next step.
            </p>
          </div>
        )}
        
        {/* Help Section - Always visible for guidance */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Tips for Better Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <p className="font-medium">📁 Recommended Files:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Design mockups & wireframes</li>
                <li>Current website screenshots</li>
                <li>Brand guidelines</li>
                <li>User research data</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">🔗 Useful URLs:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Competitor websites</li>
                <li>Your current site/app</li>
                <li>Design inspiration</li>
                <li>Industry benchmarks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SINGLE NAVIGATION SECTION */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <Button 
            variant="outline" 
            onClick={onPreviousStep}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            {attachments.length > 0 && (
              <span className="text-sm text-gray-600">
                {attachments.length} item{attachments.length !== 1 ? 's' : ''} ready
              </span>
            )}
            <Button 
              onClick={onNextStep}
              className="flex items-center space-x-2"
            >
              <span>Continue to Context</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
