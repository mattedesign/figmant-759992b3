
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  dimensions?: ImageDimensions;
  needsResize?: boolean;
}

export const CLAUDE_MAX_DIMENSION = 8000;
export const CLAUDE_MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const validateImageDimensions = async (file: File): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      // Check if dimensions exceed Claude's limits
      const exceedsLimit = dimensions.width > CLAUDE_MAX_DIMENSION || dimensions.height > CLAUDE_MAX_DIMENSION;
      
      if (exceedsLimit) {
        resolve({
          isValid: false,
          error: `Image dimensions ${dimensions.width}x${dimensions.height} exceed the maximum allowed size of ${CLAUDE_MAX_DIMENSION} pixels per dimension for AI analysis.`,
          dimensions,
          needsResize: true
        });
      } else {
        resolve({
          isValid: true,
          dimensions
        });
      }
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        isValid: false,
        error: 'Failed to load image for validation'
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const calculateResizeDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxDimension: number = CLAUDE_MAX_DIMENSION
): ImageDimensions => {
  if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  if (originalWidth > originalHeight) {
    return {
      width: maxDimension,
      height: Math.round(maxDimension / aspectRatio)
    };
  } else {
    return {
      width: Math.round(maxDimension * aspectRatio),
      height: maxDimension
    };
  }
};
