
import { calculateResizeDimensions, CLAUDE_MAX_DIMENSION } from './imageValidation';

export interface ResizeOptions {
  maxDimension?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ResizeResult {
  file: File;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
  compressionRatio: number;
}

export const resizeImageForClaudeAI = async (
  file: File,
  options: ResizeOptions = {}
): Promise<ResizeResult> => {
  const {
    maxDimension = CLAUDE_MAX_DIMENSION,
    quality = 0.9,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const originalDimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        
        const newDimensions = calculateResizeDimensions(
          originalDimensions.width,
          originalDimensions.height,
          maxDimension
        );
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        canvas.width = newDimensions.width;
        canvas.height = newDimensions.height;
        
        // Enable high-quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create resized image blob'));
              return;
            }
            
            const fileExtension = format === 'jpeg' ? 'jpg' : format;
            const fileName = file.name.replace(/\.[^/.]+$/, '') + `_resized.${fileExtension}`;
            
            const resizedFile = new File([blob], fileName, {
              type: `image/${format}`,
              lastModified: Date.now()
            });
            
            const compressionRatio = Math.round((1 - resizedFile.size / file.size) * 100);
            
            resolve({
              file: resizedFile,
              originalDimensions,
              newDimensions,
              compressionRatio
            });
          },
          `image/${format}`,
          quality
        );
        
        URL.revokeObjectURL(img.src);
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(error);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for resizing'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};
