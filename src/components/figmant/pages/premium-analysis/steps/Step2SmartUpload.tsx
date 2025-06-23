import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, Link, Image, FileText, X, RefreshCw } from 'lucide-react';
import { StepProps } from '../types';
import { ScreenshotDisplay } from '@/components/figmant/pages/analysis/components/ScreenshotDisplay';
import { AttachmentCard } from '@/components/figmant/analysis/AttachmentCard';
import { AttachmentPreviewCard } from '@/components/figmant/pages/analysis/components/AttachmentPreviewCard';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

// Custom File Preview Component that works with ChatAttachment interface
const CustomFilePreview: React.FC<{
  attachment: ChatAttachment;
  onDelete: () => void;
}> = ({ attachment, onDelete }) => {
  const getFileIcon = () => {
    if (!attachment.file) return FileText;
    
    const fileType = attachment.file.type;
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf') || fileType.includes('text')) return FileText;
    return FileText;
  };

  const getPreviewUrl = () => {
    if (attachment.file && attachment.file.type.startsWith('image/')) {
      return URL.createObjectURL(attachment.file);
    }
    return null;
  };

  const getFileSize = () => {
    if (attachment.file?.size) {
      const size = attachment.file.size;
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return '';
  };

  const IconComponent = getFileIcon();
  const previewUrl = getPreviewUrl();

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      {previewUrl ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <img 
            src={previewUrl} 
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-6 h-6 text-gray-500" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.name}
        </p>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {getFileSize() && <span>{getFileSize()}</span>}
          <span className="capitalize">{attachment.status}</span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
      >
        <X className="h-4 w-4" />
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
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [urls, setUrls] = useState<string[]>(stepData.referenceLinks || ['']);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
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
    
    // Create file attachments with proper interface structure
    const newAttachments = files.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      type: 'file' as const,
      name: file.name,
      file: file,
      status: 'uploaded' as const,
      metadata: {
        fileSize: file.size,
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }
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

  const handleUrlAdd = async (url: string) => {
    if (!url.trim()) return;

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

    // Create URL attachment with proper interface structure
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
              error: 'Screenshot capture failed',
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
    
    console.log('🔄 Retrying screenshot for:', attachment.url);
    
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
      
      console.log('🔄 Retry screenshot results:', screenshotResults);
      
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
              error: 'Screenshot retry failed',
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

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls,
      uploads: {
        ...prev.uploads,
        urls: updatedUrls.filter(url => url.trim() !== '')
      }
    }));
  };

  const handleUrlSubmit = (index: number) => {
    const url = urls[index];
    if (url.trim()) {
      handleUrlAdd(url.trim());
    }
  };

  const addUrl = () => {
    const updatedUrls = [...urls, ''];
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls
    }));
  };

  const removeUrl = (index: number) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    setStepData(prev => ({ 
      ...prev, 
      referenceLinks: updatedUrls.length > 0 ? updatedUrls : [''],
      uploads: {
        ...prev.uploads,
        urls: updatedUrls.filter(url => url.trim() !== '')
      }
    }));
  };

  const removeFile = (index: number) => {
    const currentFiles = stepData.uploadedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    
    // Also update uploads structure
    const currentUploads = stepData.uploads || { images: [], urls: [], files: [], screenshots: [] };
    const removedFile = currentFiles[index];
    let newUploads = { ...currentUploads };
    
    if (removedFile?.type.startsWith('image/')) {
      newUploads.images = newUploads.images.filter((_, i) => i !== index);
    } else {
      newUploads.files = newUploads.files.filter((_, i) => i !== index);
    }
    
    setStepData(prev => ({ 
      ...prev, 
      uploadedFiles: newFiles,
      uploads: newUploads
    }));
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const totalFiles = stepData.uploadedFiles?.length || 0;
  const hasContent = totalFiles > 0 || urls.some(url => url.trim() !== '') || attachments.length > 0;

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

        {/* Drag & Drop Zone */}
        <Card>
          <CardContent 
            className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleChooseFiles}
          >
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                Drag & drop files here, or click to browse
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports images, PDFs, Figma files, and documents (Max 10MB per file)
              </p>
              <Button variant="outline" type="button">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* URL Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Add URLs for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUrlSubmit(index);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUrlSubmit(index)}
                    disabled={!url.trim()}
                    type="button"
                  >
                    Add
                  </Button>
                  {urls.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeUrl(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addUrl}
                className="w-full"
                type="button"
              >
                Add Another URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            {attachments.length > 0 && (
              <span className="text-sm text-gray-500">
                {attachments.length} item{attachments.length !== 1 ? 's' : ''} added
              </span>
            )}
          </div>
          
          {attachments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No files or URLs added yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Upload files or add URLs above to see previews here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  {attachment.status === 'processing' && (
                    <div className="flex items-center space-x-3 text-blue-600 mb-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm font-medium">
                        {attachment.type === 'url' ? 'Capturing screenshots...' : 'Processing file...'}
                      </span>
                    </div>
                  )}
                  
                  {attachment.type === 'url' && attachment.metadata?.screenshots ? (
                    <ScreenshotDisplay
                      attachment={attachment}
                      className="w-full"
                    />
                  ) : attachment.type === 'file' ? (
                    <CustomFilePreview
                      attachment={attachment}
                      onDelete={() => removeAttachment(attachment.id)}
                    />
                  ) : null}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {attachment.type === 'url' && attachment.status === 'error' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryScreenshot(attachment)}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Retry Screenshots
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-gray-400 hover:text-destructive hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Summary */}
        {hasContent && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Content ({totalFiles} files, {urls.filter(url => url.trim()).length} URLs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stepData.uploadedFiles?.map((file: File, index: number) => (
                  <div key={`file-${index}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-600" />
                    )}
                    <span className="flex-1 truncate text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(index)}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {urls.filter(url => url.trim()).map((url, index) => (
                  <div key={`url-${index}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Link className="w-4 h-4 text-purple-600" />
                    <span className="flex-1 truncate text-sm">{url}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeUrl(urls.indexOf(url))}
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-blue-900">📁 Recommended Files:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Design mockups & wireframes</li>
                  <li>• Current website screenshots</li>
                  <li>• Brand guidelines</li>
                  <li>• User research data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-900">🔗 Useful URLs:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Competitor websites</li>
                  <li>• Your current site/app</li>
                  <li>• Design inspiration</li>
                  <li>• Industry benchmarks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPreviousStep}>
            Previous
          </Button>
          <Button onClick={onNextStep}>
            Continue to Context
          </Button>
        </div>
      </div>
    </div>
  );
};
