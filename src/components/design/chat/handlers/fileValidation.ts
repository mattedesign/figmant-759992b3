
import { ProcessedImage } from '@/utils/imageProcessing';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml' // Added SVG support
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  processedFile?: File;
  processingInfo?: ProcessedImage;
}

export const validateAndProcessImageFile = async (file: File): Promise<ValidationResult> => {
  console.log('=== FILE VALIDATION START ===');
  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Supported types: JPEG, PNG, WebP, GIF, SVG`
    };
  }

  // SVG files don't need processing, just validate and return
  if (file.type === 'image/svg+xml') {
    console.log('SVG file detected, skipping processing');
    return {
      isValid: true,
      processedFile: file,
      processingInfo: {
        file: file,
        originalSize: file.size,
        processedSize: file.size,
        compressionRatio: 0,
        dimensions: { width: 0, height: 0 },
        format: 'svg+xml'
      }
    };
  }

  try {
    // For other image types, proceed with existing processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        console.log('Image loaded, original dimensions:', img.width, 'x', img.height);
        
        const originalSize = file.size;
        let { width, height } = img;
        
        // Resize if too large
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, { type: file.type });
              const compressionRatio = Math.round(((originalSize - blob.size) / originalSize) * 100);
              
              console.log('Image processing complete:', {
                originalSize,
                processedSize: blob.size,
                compressionRatio
              });
              
              resolve({
                isValid: true,
                processedFile,
                processingInfo: {
                  file: processedFile,
                  originalSize,
                  processedSize: blob.size,
                  compressionRatio,
                  dimensions: { width, height },
                  format: file.type.split('/')[1]
                }
              });
            } else {
              resolve({
                isValid: false,
                error: 'Failed to process image'
              });
            }
          }, file.type, 0.9);
        } else {
          resolve({
            isValid: false,
            error: 'Failed to create canvas context'
          });
        }
      };

      img.onerror = () => {
        console.error('Failed to load image');
        resolve({
          isValid: false,
          error: 'Failed to load image'
        });
      };

      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error('Image validation error:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
};
