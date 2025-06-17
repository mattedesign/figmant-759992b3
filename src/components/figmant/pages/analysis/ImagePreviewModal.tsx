
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageName: string;
  imageUrl: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageName,
  imageUrl
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {imageName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-4 pb-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-auto max-h-[70vh] object-contain"
              onError={(e) => {
                console.error('Failed to load image:', imageUrl);
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="16">Failed to load image</text></svg>';
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
