
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { EnhancedImage } from '../pages/analysis/components/EnhancedImage';

export interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshot: {
    id: string;
    name: string;
    url?: string;
    thumbnailUrl?: string;
    file_name?: string;
    file_path?: string;
    file_size?: number;
    created_at?: string;
  } | null;
  screenshots?: any[];
  currentIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshot,
  screenshots = [],
  currentIndex = 0,
  onNext,
  onPrevious
}) => {
  if (!screenshot) return null;

  const hasMultiple = screenshots.length > 1;
  const currentScreenshot = screenshots.length > 0 ? screenshots[currentIndex] : screenshot;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Screenshot Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              {hasMultiple && onNext && onPrevious && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} of {screenshots.length}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onNext}
                    disabled={currentIndex === screenshots.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 flex justify-center bg-gray-50">
          <EnhancedImage
            attachment={currentScreenshot}
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            alt={currentScreenshot.file_name || currentScreenshot.name || 'Screenshot'}
          />
        </div>
        
        {/* Image Info */}
        <div className="p-4 border-t bg-gray-50">
          <h3 className="font-medium text-sm text-gray-900">
            {currentScreenshot.file_name || currentScreenshot.name}
          </h3>
          {currentScreenshot.url && (
            <p className="text-xs text-gray-500 mt-1">
              {currentScreenshot.url}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
