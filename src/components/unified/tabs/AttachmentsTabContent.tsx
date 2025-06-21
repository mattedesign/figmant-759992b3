
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Image as ImageIcon, 
  Globe, 
  FileText, 
  ExternalLink, 
  Eye,
  Download,
  X
} from 'lucide-react';
import { getAnalyzedUrls } from '@/utils/analysisAttachments';

interface AttachmentsTabContentProps {
  analysis: any;
  attachments: any[];
}

const ScreenshotModal: React.FC<{
  screenshots: any[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}> = ({ screenshots, currentIndex, isOpen, onClose, onNext, onPrevious }) => {
  const currentScreenshot = screenshots[currentIndex];
  
  if (!currentScreenshot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {currentScreenshot.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {screenshots.length > 1 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onPrevious}>
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} of {screenshots.length}
                  </span>
                  <Button variant="outline" size="sm" onClick={onNext}>
                    Next
                  </Button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 flex justify-center max-h-[calc(90vh-100px)] overflow-auto">
          <img
            src={currentScreenshot.thumbnailUrl || currentScreenshot.url}
            alt={currentScreenshot.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AttachmentCard: React.FC<{
  attachment: any;
  onViewScreenshot?: () => void;
}> = ({ attachment, onViewScreenshot }) => {
  const isUrl = attachment.type === 'link' || attachment.url;
  const hasScreenshot = attachment.thumbnailUrl || (attachment.url && onViewScreenshot);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {isUrl ? (
              <Globe className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
              {attachment.name}
            </h4>
            {attachment.url && (
              <p className="text-xs text-gray-500 truncate mb-2">{attachment.url}</p>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {attachment.type === 'link' ? 'URL' : 'File'}
              </Badge>
              
              {hasScreenshot && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={onViewScreenshot}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              
              {attachment.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => window.open(attachment.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              )}

              {attachment.thumbnailUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = attachment.thumbnailUrl;
                    link.download = attachment.name;
                    link.click();
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Save
                </Button>
              )}
            </div>
          </div>
          
          {hasScreenshot && attachment.thumbnailUrl && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={attachment.thumbnailUrl}
                alt="Preview"
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onViewScreenshot}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const AttachmentsTabContent: React.FC<AttachmentsTabContentProps> = ({
  analysis,
  attachments
}) => {
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  
  const analyzedUrls = getAnalyzedUrls(analysis);

  const screenshots = attachments
    .filter(att => att.thumbnailUrl || (att.type === 'image' && att.url))
    .map(att => ({
      thumbnailUrl: att.thumbnailUrl,
      url: att.url,
      name: att.name
    }));

  const openScreenshotModal = (index: number = 0) => {
    setCurrentScreenshotIndex(index);
    setScreenshotModalOpen(true);
  };

  const nextScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev < screenshots.length - 1 ? prev + 1 : 0
    );
  };

  const previousScreenshot = () => {
    setCurrentScreenshotIndex((prev) => 
      prev > 0 ? prev - 1 : screenshots.length - 1
    );
  };

  const allUrls = analyzedUrls.filter(url => 
    !attachments.some(att => att.url === url)
  );

  const totalItems = attachments.length + allUrls.length;

  if (totalItems === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Attachments Found</h3>
          <p className="text-gray-500">This analysis doesn't contain any files, images, or URLs.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <ImageIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{attachments.length}</div>
              <div className="text-sm text-gray-500">Files & Images</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Globe className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{allUrls.length}</div>
              <div className="text-sm text-gray-500">URLs</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Eye className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{screenshots.length}</div>
              <div className="text-sm text-gray-500">Screenshots</div>
            </CardContent>
          </Card>
        </div>

        {/* Screenshots Gallery */}
        {screenshots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Screenshots Gallery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openScreenshotModal(index)}
                  >
                    <img
                      src={screenshot.thumbnailUrl || screenshot.url}
                      alt={screenshot.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Attachments */}
        {attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Attachments
                <Badge variant="outline">{attachments.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {attachments.map((attachment, index) => (
                  <AttachmentCard
                    key={attachment.id || index}
                    attachment={attachment}
                    onViewScreenshot={() => {
                      const screenshotIndex = screenshots.findIndex(s => 
                        s.thumbnailUrl === attachment.thumbnailUrl || s.url === attachment.url
                      );
                      if (screenshotIndex !== -1) {
                        openScreenshotModal(screenshotIndex);
                      }
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analyzed URLs */}
        {allUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Analyzed URLs
                <Badge variant="outline">{allUrls.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {allUrls.map((url, index) => (
                  <AttachmentCard
                    key={`url-${index}`}
                    attachment={{
                      id: `url-${index}`,
                      name: new URL(url).hostname,
                      url: url,
                      type: 'link'
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Screenshot Modal */}
      {screenshots.length > 0 && (
        <ScreenshotModal
          screenshots={screenshots}
          currentIndex={currentScreenshotIndex}
          isOpen={screenshotModalOpen}
          onClose={() => setScreenshotModalOpen(false)}
          onNext={nextScreenshot}
          onPrevious={previousScreenshot}
        />
      )}
    </>
  );
};
