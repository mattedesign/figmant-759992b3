
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, File, FileText, Image as ImageIcon, Globe, X, Loader2, Check, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { StepProps } from '../types';
import { ScreenshotDisplay } from '@/components/figmant/pages/analysis/components/ScreenshotDisplay';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

// Compact File Preview Component
const CompactFileCard: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
}> = ({ attachment, onDelete }) => {
  const getPreviewUrl = () => {
    if (attachment.file && attachment.file.type.startsWith('image/')) {
      return URL.createObjectURL(attachment.file);
    }
    return null;
  };

  const getFileIcon = () => {
    if (!attachment.file) return File;
    const fileType = attachment.file.type;
    if (fileType.includes('pdf')) return FileText;
    return File;
  };

  const previewUrl = getPreviewUrl();
  const IconComponent = getFileIcon();

  return (
    <div className="relative group aspect-square">
      {/* File Preview/Icon */}
      <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={attachment.name}
            className="w-full h-full object-cover"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <IconComponent className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 text-center truncate w-full">
              {attachment.name}
            </span>
          </div>
        )}
        
        {/* Status Overlay */}
        {attachment.status === 'processing' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
      
      {/* Delete Button - Appears on Hover */}
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <X className="h-3 w-3" />
      </Button>
      
      {/* File Name Tooltip */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
        {attachment.name}
      </div>
    </div>
  );
};

// Compact Website Preview Component
const CompactWebsiteCard: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
  onRetry: () => void;
}> = ({ attachment, onDelete, onRetry }) => {
  const hostname = attachment.url ? new URL(attachment.url).hostname : '';
  const screenshots = attachment.metadata?.screenshots;
  const hasDesktop = screenshots?.desktop?.success;

  return (
    <div className="flex items-center space-x-3 p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
      {/* Website Screenshot/Icon */}
      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
        {hasDesktop && screenshots?.desktop?.screenshotUrl ? (
          <img 
            src={screenshots.desktop.screenshotUrl} 
            alt={hostname}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <Globe className="w-4 h-4 text-gray-400" />
        )}
      </div>
      
      {/* Website Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {hostname}
        </p>
        {attachment.status === 'processing' && (
          <p className="text-xs text-blue-600">Capturing...</p>
        )}
        {attachment.status === 'error' && (
          <button 
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Retry
          </button>
        )}
      </div>
      
      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-500"
      >
        <X className="h-3 w-3" />
      </Button>
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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.txt,.json,.fig"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Compact Files Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Files</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChooseFiles}
              className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Compact Upload Container */}
          <div 
            className={`border-2 border-dashed rounded-xl p-4 transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleChooseFiles}
          >
            {attachments.filter(att => att.type === 'file').length === 0 ? (
              // Empty State
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
              </div>
            ) : (
              // Files Preview Grid - Compact Design
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {attachments
                  .filter(att => att.type === 'file')
                  .map((attachment) => (
                    <CompactFileCard
                      key={attachment.id}
                      attachment={attachment}
                      onDelete={() => handleAttachmentRemove(attachment.id)}
                    />
                  ))
                }
                
                {/* Add More Button */}
                <div 
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={handleChooseFiles}
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Websites Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Websites</h3>
            <span className="text-sm text-gray-500">
              {attachments.filter(att => att.type === 'url').length} added
            </span>
          </div>
          
          {/* URL Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter website URL (e.g., competitor.com)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
              className="flex-1"
            />
            <Button 
              onClick={handleAddUrl} 
              disabled={!urlInput.trim()}
              size="sm"
            >
              Add
            </Button>
          </div>
          
          {/* Website Previews - Compact List */}
          {attachments.filter(att => att.type === 'url').length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attachments
                .filter(att => att.type === 'url')
                .map((attachment) => (
                  <CompactWebsiteCard
                    key={attachment.id}
                    attachment={attachment}
                    onDelete={() => handleAttachmentRemove(attachment.id)}
                    onRetry={() => handleRetryScreenshot(attachment)}
                  />
                ))
              }
            </div>
          )}
        </div>

        {/* Status Summary - Only if items exist */}
        {attachments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-900 font-medium">
                ✓ Ready for Analysis
              </span>
              <span className="text-blue-700">
                {attachments.length} item{attachments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
        
        {/* Help Section - Guidance */}
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

        {/* SINGLE NAVIGATION - Only navigation in entire component */}
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
