
import { validateImageFile, ProcessedImage } from '@/utils/imageProcessing';
import { validateImageDimensions } from '@/utils/imageValidation';
import { resizeImageForClaudeAI } from '@/utils/imageResizer';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  needsResize?: boolean;
  processedFile?: File;
  processingInfo?: ProcessedImage;
}

export const validateAndProcessImageFile = async (file: File): Promise<FileValidationResult> => {
  try {
    // Basic validation
    const basicValidation = validateImageFile(file);
    if (!basicValidation.isValid) {
      return {
        isValid: false,
        error: basicValidation.error
      };
    }

    // Dimension validation
    const dimensionValidation = await validateImageDimensions(file);
    
    let fileToProcess = file;
    let processingInfo: ProcessedImage | undefined;

    if (!dimensionValidation.isValid && dimensionValidation.needsResize) {
      console.log('Image needs resizing:', file.name);
      
      const resizeResult = await resizeImageForClaudeAI(file);
      fileToProcess = resizeResult.file;
      processingInfo = {
        file: resizeResult.file,
        originalSize: file.size,
        processedSize: resizeResult.file.size,
        compressionRatio: resizeResult.compressionRatio,
        dimensions: resizeResult.newDimensions,
        format: 'jpeg'
      };
    } else if (!dimensionValidation.isValid) {
      return {
        isValid: false,
        error: dimensionValidation.error
      };
    }

    return {
      isValid: true,
      processedFile: fileToProcess,
      processingInfo
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Validation failed';
    return {
      isValid: false,
      error: errorMessage
    };
  }
};
