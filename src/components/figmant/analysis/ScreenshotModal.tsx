
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, X } from 'lucide-react';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshot: {
    id: string;
    file_name?: string;
    file_path?: string;
    file_size?: number;
    url?: string;
    created_at?: string;
  } | null;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshot
}) => {
  if (!screenshot) return null;

  const handleDownload = () => {
    if (screenshot.file_path) {
      const link = document.createElement('a');
      link.href = screenshot.file_path;
      link.download = screenshot.file_name || 'screenshot.png';
      link.click();
    }
  };

  const handleExternalLink = () => {
    if (screenshot.url) {
      window.open(screenshot.url, '_blank');
    }
  };

  const getFileSize = () => {
    if (!screenshot.file_size) return '';
    const sizeInKB = Math.round(screenshot.file_size / 1024);
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${Math.round(sizeInKB / 1024)} MB`;
  };

  const imageUrl = screenshot.file_path || screenshot.url;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {screenshot.file_name || 'Screenshot'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {screenshot.file_size && (
                <Badge variant="secondary" className="text-xs">
                  {getFileSize()}
                </Badge>
              )}
              {screenshot.created_at && (
                <Badge variant="outline" className="text-xs">
                  {new Date(screenshot.created_at).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Image Display */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={screenshot.file_name || 'Screenshot'}
              className="max-w-full max-h-[60vh] object-contain"
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Image not available</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {screenshot.created_at && (
              <span>
                Captured on {new Date(screenshot.created_at).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {screenshot.file_path && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            {screenshot.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExternalLink}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Original
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
