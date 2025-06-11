
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageProcessor, ProcessedImage, validateImageFile, shouldCompressImage } from '@/utils/imageProcessing';
import { Image, Minimize2, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedImageUploadProps {
  file: File;
  onProcessed: (processedFile: File, processingInfo: ProcessedImage) => void;
  onError: (error: string) => void;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  file,
  onProcessed,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedInfo, setProcessedInfo] = useState<ProcessedImage | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const processImage = useCallback(async () => {
    try {
      setIsProcessing(true);
      setProcessingProgress(0);
      setValidationError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid file');
        onError(validation.error || 'Invalid file');
        return;
      }

      setProcessingProgress(25);

      // Check if compression is needed
      const needsCompression = shouldCompressImage(file);
      
      if (!needsCompression) {
        // File is small enough, use as-is
        const info = await ImageProcessor.getImageInfo(file);
        const processedInfo: ProcessedImage = {
          file,
          originalSize: file.size,
          processedSize: file.size,
          compressionRatio: 0,
          dimensions: { width: info.width, height: info.height },
          format: file.type.split('/')[1]
        };
        
        setProcessedInfo(processedInfo);
        setProcessingProgress(100);
        onProcessed(file, processedInfo);
        
        toast({
          title: "Image Ready",
          description: "Image is already optimized and ready for analysis.",
        });
        
        return;
      }

      setProcessingProgress(50);

      // Process the image with compression
      const processed = await ImageProcessor.processImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        targetFormat: 'jpeg'
      });

      setProcessingProgress(100);
      setProcessedInfo(processed);
      onProcessed(processed.file, processed);

      toast({
        title: "Image Processed",
        description: `Image compressed by ${processed.compressionRatio}% for optimal analysis.`,
      });

    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setValidationError(errorMessage);
      onError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, onProcessed, onError, toast]);

  React.useEffect(() => {
    processImage();
  }, [processImage]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Image className="h-4 w-4" />
        <span className="text-sm font-medium">{file.name}</span>
        {processedInfo && (
          <Badge variant="outline" className="text-xs">
            {processedInfo.dimensions.width} × {processedInfo.dimensions.height}
          </Badge>
        )}
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing image...
          </div>
          <Progress value={processingProgress} className="h-2" />
        </div>
      )}

      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {processedInfo && !validationError && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-3 w-3" />
            Ready for analysis
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Original: {formatFileSize(processedInfo.originalSize)}</div>
            <div>Processed: {formatFileSize(processedInfo.processedSize)}</div>
            {processedInfo.compressionRatio > 0 && (
              <>
                <div className="flex items-center gap-1">
                  <Minimize2 className="h-3 w-3" />
                  Compressed: {processedInfo.compressionRatio}%
                </div>
                <div>Format: {processedInfo.format.toUpperCase()}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
