
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageProcessor, ProcessedImage, validateImageFile, shouldCompressImage } from '@/utils/imageProcessing';
import { validateImageDimensions } from '@/utils/imageValidation';
import { Image, Minimize2, CheckCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useImageProcessingMonitor } from '@/hooks/useImageProcessingMonitor';
import { logImageProcessing } from '@/utils/imageProcessingLogger';
import { ImageProcessingErrorReport } from './ImageProcessingErrorReport';
import { FallbackImageProcessor } from './FallbackImageProcessor';

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
  const [showFallback, setShowFallback] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addJob, updateJobProgress, completeJob, failJob, errors, retryError, dismissError } = useImageProcessingMonitor();

  const processImage = useCallback(async (fallbackMethod?: string) => {
    const jobId = addJob(file);
    
    try {
      setIsProcessing(true);
      setProcessingProgress(0);
      setValidationError(null);
      setProcessingError(null);
      setShowFallback(false);

      // Log processing start
      logImageProcessing.validation.start(file.name);
      
      // Validate file
      updateJobProgress(jobId, 'validating', 10);
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        logImageProcessing.validation.error(file.name, validation.error || 'Invalid file');
        setValidationError(validation.error || 'Invalid file');
        failJob(jobId, 'VALIDATION_FAILED', validation.error || 'Invalid file', 'validation');
        onError(validation.error || 'Invalid file');
        return;
      }

      logImageProcessing.validation.success(file.name);
      setProcessingProgress(25);
      updateJobProgress(jobId, 'validating', 25);

      // Validate dimensions for Claude AI compatibility
      updateJobProgress(jobId, 'validating', 40);
      const dimensionValidation = await validateImageDimensions(file);
      
      if (!dimensionValidation.isValid && !dimensionValidation.needsResize) {
        // This is an error that can't be fixed by resizing
        const errorMessage = dimensionValidation.error || 'Image validation failed';
        logImageProcessing.validation.error(file.name, errorMessage);
        setValidationError(errorMessage);
        failJob(jobId, 'DIMENSION_VALIDATION_FAILED', errorMessage, 'validation');
        onError(errorMessage);
        return;
      }

      // Check if compression/resizing is needed
      const needsProcessing = shouldCompressImage(file) || dimensionValidation.needsResize;
      
      if (!needsProcessing && !fallbackMethod) {
        // File is already optimized and within Claude AI limits
        updateJobProgress(jobId, 'completed', 100);
        const info = await ImageProcessor.getImageInfo(file);
        const processedInfo: ProcessedImage = {
          file,
          originalSize: file.size,
          processedSize: file.size,
          compressionRatio: 0,
          dimensions: { width: info.width, height: info.height },
          format: file.type.split('/')[1],
          wasResizedForAI: false
        };
        
        setProcessedInfo(processedInfo);
        setProcessingProgress(100);
        completeJob(jobId, {
          compressionRatio: 0,
          processingTime: 0,
          finalSize: file.size
        });
        
        onProcessed(file, processedInfo);
        
        logImageProcessing.upload.success(file.name, 0, 'direct');
        toast({
          title: "Image Ready",
          description: "Image is already optimized for AI analysis.",
        });
        
        return;
      }

      // Process the image with enhanced validation and Claude AI compatibility
      updateJobProgress(jobId, 'compressing', 60);
      logImageProcessing.compression.start(file.name, file.size);
      
      // Use enforceClaudeLimits option to ensure compatibility
      const processed = await ImageProcessor.processImage(file, {
        maxWidth: fallbackMethod === 'client-side-basic' ? 1280 : 1920,
        maxHeight: fallbackMethod === 'client-side-basic' ? 720 : 1080,
        quality: fallbackMethod === 'progressive-quality' ? 0.7 : 0.85,
        targetFormat: 'jpeg',
        enforceClaudeLimits: true // This ensures Claude AI dimension limits are enforced
      });

      updateJobProgress(jobId, 'completed', 100);
      logImageProcessing.compression.success(
        file.name, 
        processed.compressionRatio, 
        processed.file.size,
        0
      );

      setProcessingProgress(100);
      setProcessedInfo(processed);
      completeJob(jobId, {
        compressionRatio: processed.compressionRatio,
        processingTime: 0,
        finalSize: processed.file.size
      });
      
      onProcessed(processed.file, processed);

      const resizeMessage = processed.wasResizedForAI 
        ? " and resized for AI compatibility"
        : "";

      toast({
        title: "Image Processed",
        description: `Image optimized${resizeMessage} (${processed.compressionRatio}% size reduction).`,
      });

    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      
      logImageProcessing.compression.error(file.name, errorMessage);
      setProcessingError(errorMessage);
      failJob(jobId, 'PROCESSING_FAILED', errorMessage, 'compression');
      
      // Show fallback options instead of immediate error
      if (!fallbackMethod) {
        setShowFallback(true);
      } else {
        setValidationError(errorMessage);
        onError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: errorMessage,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, onProcessed, onError, addJob, updateJobProgress, completeJob, failJob, toast]);

  React.useEffect(() => {
    processImage();
  }, [processImage]);

  const handleFallbackProcessing = async (methodId: string, file: File) => {
    await processImage(methodId);
    setShowFallback(false);
  };

  const handleRetryError = async (errorId: string) => {
    await retryError(errorId, () => processImage());
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // Show fallback processor if needed
  if (showFallback && processingError) {
    return (
      <FallbackImageProcessor
        fileName={file.name}
        fileSize={file.size}
        originalError={processingError}
        onProcessWithFallback={handleFallbackProcessing}
        onCancel={() => {
          setShowFallback(false);
          onError(processingError);
        }}
        file={file}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          <span className="text-sm font-medium">{file.name}</span>
          {processedInfo && (
            <>
              <Badge variant="outline" className="text-xs">
                {processedInfo.dimensions.width} × {processedInfo.dimensions.height}
              </Badge>
              {processedInfo.wasResizedForAI && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  <Shield className="h-2 w-2 mr-1" />
                  AI Compatible
                </Badge>
              )}
            </>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing and validating image...
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
              Ready for AI analysis
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Original: {formatFileSize(processedInfo.originalSize)}</div>
              <div>Processed: {formatFileSize(processedInfo.processedSize)}</div>
              {processedInfo.compressionRatio > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    <Minimize2 className="h-3 w-3" />
                    Optimized: {processedInfo.compressionRatio}%
                  </div>
                  <div>Format: {processedInfo.format.toUpperCase()}</div>
                </>
              )}
            </div>
            
            {processedInfo.wasResizedForAI && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Image was resized to meet Claude AI's dimension requirements for optimal analysis.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Reports */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map(error => (
            <ImageProcessingErrorReport
              key={error.id}
              error={error}
              onRetry={handleRetryError}
              onDismiss={dismissError}
            />
          ))}
        </div>
      )}
    </div>
  );
};
