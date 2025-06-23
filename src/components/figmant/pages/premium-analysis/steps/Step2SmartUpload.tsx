
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

// File Preview Component
const FilePreviewCard: React.FC<{
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
        
        {attachment.status === 'processing' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
        {attachment.name}
      </div>
    </div>
  );
};

// Website Preview Component
const WebsitePreviewCard: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
  onRetry: () => void;
}> = ({ attachment, onDelete, onRetry }) => {
  const hostname = attachment.url ? new URL(attachment.url).hostname : '';
  const screenshots = attachment.metadata?.screenshots;
  const hasDesktop = screenshots?.desktop?.success;

  return (
    <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
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
  console.log('🔍 Step2SmartUpload rendered with stepData:', stepData);
  
  const [dragActive, setDragActive] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    console.log('📁 File upload called with files:', files.length);
    
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = [...currentFiles, ...files];
    
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

    // Reset file input to allow selecting same file again
    setFileInputKey(prev => prev + 1);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleScreenshotCapture = async (attachment: ChatAttachment, url: string) => {
    console.log('📸 Starting screenshot capture for:', url);
    
    try {
      const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
        [url],
        true, // desktop
        true  // mobile
      );

      console.log('📸 Screenshot results:', screenshotResults);

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
        att.id === attachment.id 
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
          description: `Unable to capture screenshots for ${new URL(url).hostname}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('📸 Screenshot capture error:', error);
      
      setAttachments(prev => prev.map(att => 
        att.id === attachment.id 
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
        description: `Unable to capture screenshots for ${new URL(url).hostname}. The website will still be analyzed.`,
      });
    }
  };

  const handleAddUrl = async () => {
    console.log('🔗 handleAddUrl called with:', urlInput);
    
    const url = urlInput.trim();
    if (!url) {
      console.log('🔗 URL input is empty, returning');
      return;
    }

    console.log('🔗 Processing URL:', url);

    try {
      // Format URL properly
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log('🔗 Formatted URL:', formattedUrl);
      
      new URL(formattedUrl); // Validate URL format
      console.log('🔗 URL validation passed');
    } catch {
      console.error('🔗 Invalid URL format:', url);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
      });
      return;
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const urlAttachment: ChatAttachment = {
      id: `url-${Date.now()}-${Math.random()}`,
      type: 'url',
      name: new URL(formattedUrl).hostname,
      url: formattedUrl,
      status: 'processing',
      metadata: {
        screenshots: {
          desktop: { success: false, url: formattedUrl },
          mobile: { success: false, url: formattedUrl }
        }
      }
    };

    console.log('🔗 Created attachment:', urlAttachment);
    
    setAttachments(prev => [...prev, urlAttachment]);
    setUrlInput('');
    console.log('🔗 URL added to attachments and input cleared');

    toast({
      title: "Capturing Screenshots",
      description: `Starting screenshot capture for ${urlAttachment.name}...`,
    });

    // Start screenshot capture in background
    handleScreenshotCapture(urlAttachment, formattedUrl);
  };

  const handleRetryScreenshot = async (attachment: ChatAttachment) => {
    if (attachment.type !== 'url' || !attachment.url) return;
    
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
    
    await handleScreenshotCapture(attachment, attachment.url);
  };

  const handleAttachmentRemove = (id: string) => {
    console.log('🗑️ Removing attachment:', id);
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.sketch,.fig,.xd"
        className="hidden"
        onChange={handleFileSelect}
        key={fileInputKey}
      />

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Content</h1>
        <p className="text-gray-600">
          Add screenshots, designs, competitor URLs, or documents for analysis (optional)
        </p>
      </div>
      
      {/* Main Upload Sections */}
      <div className="space-y-8">
        
        {/* Files Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Files</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFileDialog}
              className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Upload Container */}
          <div 
            className={`border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {attachments.filter(att => att.type === 'file').length === 0 ? (
              // Empty State
              <div className="text-center py-8">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">Click to upload or drag & drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            ) : (
              // Files Grid
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {attachments
                  .filter(att => att.type === 'file')
                  .map((attachment) => (
                    <FilePreviewCard
                      key={attachment.id}
                      attachment={attachment}
                      onDelete={() => handleAttachmentRemove(attachment.id)}
                    />
                  ))
                }
                
                {/* Add More Button */}
                <div 
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
                  onClick={openFileDialog}
                >
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Websites Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Websites</h2>
            <span className="text-sm text-gray-500">
              {attachments.filter(att => att.type === 'url').length} added
            </span>
          </div>
          
          {/* URL Input */}
          <div className="flex space-x-3">
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
            >
              Add
            </Button>
          </div>
          
          {/* Website List */}
          {attachments.filter(att => att.type === 'url').length > 0 && (
            <div className="space-y-3">
              {attachments
                .filter(att => att.type === 'url')
                .map((attachment) => (
                  <WebsitePreviewCard
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

        {/* Tips Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">💡 Tips for Better Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <p className="font-medium text-gray-700 mb-2">📁 Recommended Files:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Design mockups & wireframes</li>
                <li>Current website screenshots</li>
                <li>Brand guidelines</li>
                <li>User research data</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">🔗 Useful URLs:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Competitor websites</li>
                <li>Your current site/app</li>
                <li>Design inspiration</li>
                <li>Industry benchmarks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SINGLE NAVIGATION - ONLY ONE SET OF BUTTONS */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
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
  );
};
