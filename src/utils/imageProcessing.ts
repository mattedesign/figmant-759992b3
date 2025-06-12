
import { validateImageDimensions, CLAUDE_MAX_DIMENSION } from './imageValidation';
import { resizeImageForClaudeAI } from './imageResizer';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
  targetFormat?: 'jpeg' | 'png' | 'webp';
  enforceClaudeLimits?: boolean;
}

export interface ProcessedImage {
  file: File;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
  format: string;
  wasResizedForAI?: boolean;
}

export class ImageProcessor {
  private static readonly DEFAULT_OPTIONS: Required<Omit<ImageProcessingOptions, 'enforceClaudeLimits'>> & { enforceClaudeLimits: boolean } = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    targetFormat: 'jpeg',
    enforceClaudeLimits: true
  };

  static async processImage(
    file: File, 
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Validate file type
    if (!this.isValidImageType(file)) {
      throw new Error(`Unsupported file type: ${file.type}. Supported types: JPEG, PNG, WebP, GIF`);
    }

    // Check file size
    if (file.size > config.maxSizeBytes) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${(config.maxSizeBytes / 1024 / 1024).toFixed(2)}MB`);
    }

    try {
      // First check if we need to enforce Claude AI dimension limits
      if (config.enforceClaudeLimits) {
        const dimensionValidation = await validateImageDimensions(file);
        
        if (!dimensionValidation.isValid && dimensionValidation.needsResize) {
          // Use the specialized Claude AI resizer
          const resizeResult = await resizeImageForClaudeAI(file, {
            maxDimension: CLAUDE_MAX_DIMENSION,
            quality: config.quality,
            format: config.targetFormat === 'png' ? 'png' : 'jpeg'
          });

          return {
            file: resizeResult.file,
            originalSize: file.size,
            processedSize: resizeResult.file.size,
            compressionRatio: resizeResult.compressionRatio,
            dimensions: resizeResult.newDimensions,
            format: config.targetFormat,
            wasResizedForAI: true
          };
        } else if (!dimensionValidation.isValid) {
          throw new Error(dimensionValidation.error || 'Image validation failed');
        }
      }

      // If no Claude AI resizing needed, use standard processing
      const image = await this.loadImage(file);
      const canvas = this.createCanvas(image, config);
      const processedFile = await this.canvasToFile(canvas, file.name, config);

      return {
        file: processedFile,
        originalSize: file.size,
        processedSize: processedFile.size,
        compressionRatio: Math.round((1 - processedFile.size / file.size) * 100),
        dimensions: { width: canvas.width, height: canvas.height },
        format: config.targetFormat,
        wasResizedForAI: false
      };
    } catch (error) {
      console.error('Image processing failed:', error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type.toLowerCase());
  }

  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static createCanvas(
    image: HTMLImageElement, 
    config: Required<Omit<ImageProcessingOptions, 'enforceClaudeLimits'>> & { enforceClaudeLimits: boolean }
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Calculate new dimensions while maintaining aspect ratio
    const { width, height } = this.calculateDimensions(
      image.naturalWidth,
      image.naturalHeight,
      config.maxWidth,
      config.maxHeight
    );

    canvas.width = width;
    canvas.height = height;

    // Apply image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the resized image
    ctx.drawImage(image, 0, 0, width, height);

    return canvas;
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }

  private static canvasToFile(
    canvas: HTMLCanvasElement,
    originalName: string,
    config: Required<Omit<ImageProcessingOptions, 'enforceClaudeLimits'>> & { enforceClaudeLimits: boolean }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          const extension = config.targetFormat === 'jpeg' ? 'jpg' : config.targetFormat;
          const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
          const newName = `${nameWithoutExt}_processed.${extension}`;

          const file = new File([blob], newName, {
            type: `image/${config.targetFormat}`,
            lastModified: Date.now()
          });

          resolve(file);
        },
        `image/${config.targetFormat}`,
        config.targetFormat === 'jpeg' ? config.quality : undefined
      );
    });
  }

  static getImageInfo(file: File): Promise<{ width: number; height: number; size: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for info'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Utility functions for validation
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Supported types: JPEG, PNG, WebP, GIF`
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 50MB`
    };
  }

  return { isValid: true };
};

export const shouldCompressImage = (file: File): boolean => {
  const compressionThreshold = 2 * 1024 * 1024; // 2MB
  return file.size > compressionThreshold;
};
