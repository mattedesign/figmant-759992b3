
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Maximize, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { validateImageDimensions, ImageValidationResult } from '@/utils/imageValidation';
import { resizeImageForClaudeAI, ResizeResult } from '@/utils/imageResizer';
import { useToast } from '@/hooks/use-toast';

interface ImageDimensionValidatorProps {
  file: File;
  onValidationComplete: (file: File, resizeInfo?: ResizeResult) => void;
  onValidationError: (error: string) => void;
}

export const ImageDimensionValidator: React.FC<ImageDimensionValidatorProps> = ({
  file,
  onValidationComplete,
  onValidationError
}) => {
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    validateFile();
  }, [file]);

  const validateFile = async () => {
    try {
      const result = await validateImageDimensions(file);
      setValidationResult(result);
      
      if (result.isValid) {
        onValidationComplete(file);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed';
      onValidationError(errorMessage);
    }
  };

  const handleResize = async () => {
    if (!validationResult?.needsResize) return;
    
    setIsResizing(true);
    try {
      const result = await resizeImageForClaudeAI(file, {
        quality: 0.9,
        format: 'jpeg'
      });
      
      setResizeResult(result);
      
      toast({
        title: "Image Resized Successfully",
        description: `Resized from ${result.originalDimensions.width}x${result.originalDimensions.height} to ${result.newDimensions.width}x${result.newDimensions.height}`,
      });
      
      onValidationComplete(result.file, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Resize failed';
      onValidationError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Resize Failed",
        description: errorMessage,
      });
    } finally {
      setIsResizing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (!validationResult) {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Validating image dimensions...</span>
      </div>
    );
  }

  if (validationResult.isValid) {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800">
          Image validated successfully ({validationResult.dimensions?.width}x{validationResult.dimensions?.height})
        </span>
      </div>
    );
  }

  if (resizeResult) {
    return (
      <div className="space-y-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800 font-medium">Image resized for AI analysis</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          <div>Original: {resizeResult.originalDimensions.width}x{resizeResult.originalDimensions.height}</div>
          <div>Resized: {resizeResult.newDimensions.width}x{resizeResult.newDimensions.height}</div>
          <div>Original size: {formatFileSize(file.size)}</div>
          <div>New size: {formatFileSize(resizeResult.file.size)}</div>
        </div>
        {resizeResult.compressionRatio > 0 && (
          <Badge variant="outline" className="text-xs">
            {resizeResult.compressionRatio}% size reduction
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <div>
          <p className="text-sm font-medium text-orange-800">Image Too Large for AI Analysis</p>
          <p className="text-xs text-orange-700 mt-1">{validationResult.error}</p>
          {validationResult.dimensions && (
            <div className="flex items-center gap-2 mt-2">
              <ImageIcon className="h-3 w-3" />
              <span className="text-xs">
                Current: {validationResult.dimensions.width}x{validationResult.dimensions.height} pixels
              </span>
            </div>
          )}
        </div>
        
        {validationResult.needsResize && (
          <Button
            onClick={handleResize}
            disabled={isResizing}
            size="sm"
            className="flex items-center gap-2"
          >
            {isResizing ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Resizing...
              </>
            ) : (
              <>
                <Maximize className="h-3 w-3" />
                Resize for AI Analysis
              </>
            )}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
