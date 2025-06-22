
import { supabase } from '@/integrations/supabase/client';

export class ImageService {
  /**
   * Get a public URL for a file in any storage bucket
   */
  static getPublicUrl(filePath: string, bucket: string = 'design-uploads'): string {
    if (!filePath) return '';
    
    // If it's already a full URL, return as-is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Detect if a URL is from ScreenshotOne API
   */
  static isScreenshotOneUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('api.screenshotone.com') || url.includes('screenshotone.com/api');
  }

  /**
   * Check if a URL is accessible by attempting to load it
   * Enhanced to handle ScreenshotOne API URLs properly
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    
    // Skip validation for blob URLs as they're likely expired
    if (url.startsWith('blob:')) {
      return false;
    }
    
    // For ScreenshotOne URLs, always consider them valid since they're API endpoints
    // The actual validation will happen when the image loads in the browser
    if (this.isScreenshotOneUrl(url)) {
      console.log('🔍 SCREENSHOT URL - ScreenshotOne URL detected, considering valid:', url);
      return true;
    }
    
    // For regular URLs, use the standard validation with improved timeout
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        console.log('🔍 IMAGE VALIDATION - Timeout for URL:', url);
        resolve(false);
      }, 3000); // Reduced timeout for faster response
      
      img.onload = () => {
        clearTimeout(timeoutId);
        console.log('🔍 IMAGE VALIDATION - Success for URL:', url);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        console.log('🔍 IMAGE VALIDATION - Failed for URL:', url);
        resolve(false);
      };
      
      img.src = url;
    });
  }

  /**
   * Resolve the best available image URL for an attachment with bucket detection
   */
  static resolveImageUrl(attachment: any): string | null {
    if (!attachment) return null;

    console.log('🔍 RESOLVE IMAGE URL - Processing attachment:', {
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      url: attachment.url,
      file_path: attachment.file_path,
      path: attachment.path
    });

    // Handle blob URLs - these are temporary and should be ignored for stored files
    const skipBlobUrls = true;

    // Try different URL properties in order of preference
    const urlCandidates = [
      // First try storage paths (most reliable for uploaded files)
      attachment.file_path,
      attachment.path, // Handle stored data structure
      attachment.uploadPath,
      // Then try actual URLs (but skip blob URLs for stored content)
      !skipBlobUrls || !attachment.url?.startsWith('blob:') ? attachment.url : null,
      !skipBlobUrls || !attachment.thumbnailUrl?.startsWith('blob:') ? attachment.thumbnailUrl : null,
    ].filter(Boolean);

    for (const candidate of urlCandidates) {
      if (candidate && typeof candidate === 'string') {
        // If it's a storage path, convert to public URL
        if (!candidate.startsWith('http')) {
          // Try analysis-attachments bucket first, then design-uploads
          const analysisUrl = this.getPublicUrl(candidate, 'analysis-attachments');
          const designUrl = this.getPublicUrl(candidate, 'design-uploads');
          
          // Return the first one that looks valid (non-empty path)
          const resolvedUrl = candidate.includes('analysis') ? analysisUrl : designUrl;
          console.log('🔍 RESOLVE IMAGE URL - Resolved storage path to:', resolvedUrl);
          return resolvedUrl;
        }
        console.log('🔍 RESOLVE IMAGE URL - Using direct URL:', candidate);
        return candidate;
      }
    }

    console.log('🔍 RESOLVE IMAGE URL - No valid URL found');
    return null;
  }

  /**
   * Get the best available image URL with enhanced validation for different URL types
   */
  static async getBestImageUrl(attachment: any): Promise<string | null> {
    const primaryUrl = this.resolveImageUrl(attachment);
    
    if (!primaryUrl) {
      console.log('🔍 BEST IMAGE URL - No primary URL found');
      return null;
    }
    
    // For ScreenshotOne URLs, return them directly since validation will happen in the browser
    if (this.isScreenshotOneUrl(primaryUrl)) {
      console.log('🔍 BEST IMAGE URL - Returning ScreenshotOne URL directly:', primaryUrl);
      return primaryUrl;
    }
    
    // Test if the primary URL works for non-ScreenshotOne URLs
    const isValid = await this.validateImageUrl(primaryUrl);
    if (isValid) {
      console.log('🔍 BEST IMAGE URL - Primary URL validated successfully:', primaryUrl);
      return primaryUrl;
    }
    
    console.log('🔍 BEST IMAGE URL - Primary URL validation failed, trying fallbacks');
    
    // If primary URL fails, try other storage-based options with different buckets
    const fallbackCandidates = [
      { path: attachment.file_path, bucket: 'analysis-attachments' },
      { path: attachment.path, bucket: 'analysis-attachments' },
      { path: attachment.file_path, bucket: 'design-uploads' },
      { path: attachment.path, bucket: 'design-uploads' },
      { path: attachment.uploadPath, bucket: 'design-uploads' },
    ].filter(candidate => candidate.path);
    
    for (const candidate of fallbackCandidates) {
      if (candidate.path && !candidate.path.startsWith('http')) {
        const resolvedUrl = this.getPublicUrl(candidate.path, candidate.bucket);
        const isValid = await this.validateImageUrl(resolvedUrl);
        if (isValid) {
          console.log('🔍 BEST IMAGE URL - Fallback URL validated successfully:', resolvedUrl);
          return resolvedUrl;
        }
      }
    }
    
    console.log('🔍 BEST IMAGE URL - All validation attempts failed');
    return null;
  }

  /**
   * Handle screenshot metadata and return best image URL with proper ScreenshotOne handling
   */
  static getScreenshotUrl(attachment: any): string | null {
    if (!attachment?.metadata?.screenshots) {
      console.log('🔍 SCREENSHOT URL - No screenshot metadata found');
      return null;
    }

    const { desktop, mobile } = attachment.metadata.screenshots;
    
    // Helper function to get the best URL from screenshot data
    const getBestScreenshotUrl = (screenshotData: any) => {
      if (!screenshotData) return null;
      
      // For ScreenshotOne, prioritize API URLs over file paths
      if (screenshotData.screenshotUrl && this.isScreenshotOneUrl(screenshotData.screenshotUrl)) {
        console.log('🔍 SCREENSHOT URL - Using ScreenshotOne screenshotUrl:', screenshotData.screenshotUrl);
        return screenshotData.screenshotUrl;
      }
      
      if (screenshotData.thumbnailUrl && this.isScreenshotOneUrl(screenshotData.thumbnailUrl)) {
        console.log('🔍 SCREENSHOT URL - Using ScreenshotOne thumbnailUrl:', screenshotData.thumbnailUrl);
        return screenshotData.thumbnailUrl;
      }
      
      // Fall back to storage paths or other URLs
      const fallbackUrl = screenshotData.file_path || screenshotData.path || screenshotData.thumbnailUrl || screenshotData.url;
      if (fallbackUrl) {
        console.log('🔍 SCREENSHOT URL - Using fallback URL:', fallbackUrl);
        return fallbackUrl;
      }
      
      return null;
    };

    // Check desktop first, then mobile
    if (desktop?.success) {
      const desktopUrl = getBestScreenshotUrl(desktop);
      if (desktopUrl) return desktopUrl;
    }
    
    if (mobile?.success) {
      const mobileUrl = getBestScreenshotUrl(mobile);
      if (mobileUrl) return mobileUrl;
    }
    
    console.log('🔍 SCREENSHOT URL - No valid screenshot URL found');
    return null;
  }

  /**
   * Enhanced URL resolution specifically for analysis attachments with improved ScreenshotOne handling
   */
  static resolveAnalysisAttachmentUrl(attachment: any): string | null {
    if (!attachment) return null;

    console.log('🔍 ANALYSIS ATTACHMENT - Resolving URL for:', {
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      hasMetadata: !!attachment.metadata,
      hasScreenshots: !!attachment.metadata?.screenshots
    });

    // For URL-type attachments, prioritize screenshots
    if (attachment.type === 'url' || attachment.url) {
      const screenshotUrl = this.getScreenshotUrl(attachment);
      if (screenshotUrl) {
        // For ScreenshotOne URLs, return them directly
        if (this.isScreenshotOneUrl(screenshotUrl)) {
          console.log('🔍 ANALYSIS ATTACHMENT - Using ScreenshotOne URL:', screenshotUrl);
          return screenshotUrl;
        }
        // For other URLs, convert storage paths to public URLs
        const resolvedUrl = screenshotUrl.startsWith('http') ? 
          screenshotUrl : 
          this.getPublicUrl(screenshotUrl, 'analysis-attachments');
        console.log('🔍 ANALYSIS ATTACHMENT - Using screenshot URL:', resolvedUrl);
        return resolvedUrl;
      }
    }

    // For file attachments, use standard resolution
    if (attachment.type === 'file' || attachment.file_path || attachment.path) {
      const resolvedUrl = this.resolveImageUrl(attachment);
      console.log('🔍 ANALYSIS ATTACHMENT - Using file URL:', resolvedUrl);
      return resolvedUrl;
    }

    // Fallback to general resolution
    const fallbackUrl = this.resolveImageUrl(attachment);
    console.log('🔍 ANALYSIS ATTACHMENT - Using fallback URL:', fallbackUrl);
    return fallbackUrl;
  }
}
