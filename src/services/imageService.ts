
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
      console.log('🔍 SCREENSHOT URL - ScreenshotOne URL detected, skipping validation:', url);
      return true;
    }
    
    // For regular URLs, use the standard validation
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => resolve(false), 5000);
      
      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
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
          return candidate.includes('analysis') ? analysisUrl : designUrl;
        }
        return candidate;
      }
    }

    return null;
  }

  /**
   * Get the best available image URL with fallback handling
   * Enhanced to handle ScreenshotOne URLs properly
   */
  static async getBestImageUrl(attachment: any): Promise<string | null> {
    const primaryUrl = this.resolveImageUrl(attachment);
    
    if (!primaryUrl) return null;
    
    // For ScreenshotOne URLs, return them directly since they're API endpoints
    if (this.isScreenshotOneUrl(primaryUrl)) {
      console.log('🔍 SCREENSHOT URL - Returning ScreenshotOne URL directly:', primaryUrl);
      return primaryUrl;
    }
    
    // Test if the primary URL works for non-ScreenshotOne URLs
    const isValid = await this.validateImageUrl(primaryUrl);
    if (isValid) return primaryUrl;
    
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
        if (isValid) return resolvedUrl;
      }
    }
    
    return null;
  }

  /**
   * Handle screenshot metadata and return best image URL
   * Enhanced to properly handle ScreenshotOne URLs
   */
  static getScreenshotUrl(attachment: any): string | null {
    // Check if we have screenshot data in metadata
    const hasDesktopScreenshot = attachment.metadata?.screenshots?.desktop?.success;
    const hasMobileScreenshot = attachment.metadata?.screenshots?.mobile?.success;
    
    if (hasDesktopScreenshot) {
      const desktop = attachment.metadata.screenshots.desktop;
      // For ScreenshotOne, prefer screenshotUrl over file paths
      if (desktop.screenshotUrl && this.isScreenshotOneUrl(desktop.screenshotUrl)) {
        return desktop.screenshotUrl;
      }
      // Then try thumbnail URL
      if (desktop.thumbnailUrl && this.isScreenshotOneUrl(desktop.thumbnailUrl)) {
        return desktop.thumbnailUrl;
      }
      // Fall back to storage paths
      return desktop.file_path || desktop.path || desktop.thumbnailUrl || desktop.url;
    }
    
    if (hasMobileScreenshot) {
      const mobile = attachment.metadata.screenshots.mobile;
      // For ScreenshotOne, prefer screenshotUrl over file paths
      if (mobile.screenshotUrl && this.isScreenshotOneUrl(mobile.screenshotUrl)) {
        return mobile.screenshotUrl;
      }
      // Then try thumbnail URL
      if (mobile.thumbnailUrl && this.isScreenshotOneUrl(mobile.thumbnailUrl)) {
        return mobile.thumbnailUrl;
      }
      // Fall back to storage paths
      return mobile.file_path || mobile.path || mobile.thumbnailUrl || mobile.url;
    }
    
    return null;
  }

  /**
   * Enhanced URL resolution specifically for analysis attachments
   * Improved to handle ScreenshotOne URLs properly
   */
  static resolveAnalysisAttachmentUrl(attachment: any): string | null {
    if (!attachment) return null;

    console.log('🔍 RESOLVING ANALYSIS ATTACHMENT:', {
      id: attachment.id,
      name: attachment.name,
      type: attachment.type,
      url: attachment.url,
      file_path: attachment.file_path,
      path: attachment.path,
      thumbnailUrl: attachment.thumbnailUrl,
      metadata: attachment.metadata
    });

    // For URL-type attachments, check for screenshots first
    if (attachment.type === 'url' || attachment.url) {
      const screenshotUrl = this.getScreenshotUrl(attachment);
      if (screenshotUrl) {
        // For ScreenshotOne URLs, return them directly
        if (this.isScreenshotOneUrl(screenshotUrl)) {
          console.log('📸 SCREENSHOTONE URL RESOLVED:', screenshotUrl);
          return screenshotUrl;
        }
        // For other URLs, convert storage paths to public URLs
        const resolvedUrl = screenshotUrl.startsWith('http') ? screenshotUrl : this.getPublicUrl(screenshotUrl, 'analysis-attachments');
        console.log('📸 SCREENSHOT URL RESOLVED:', resolvedUrl);
        return resolvedUrl;
      }
    }

    // For file attachments, prioritize storage paths with correct bucket
    if (attachment.type === 'file' || attachment.file_path || attachment.path) {
      const resolvedUrl = this.resolveImageUrl(attachment);
      console.log('📁 FILE URL RESOLVED:', resolvedUrl);
      return resolvedUrl;
    }

    // Fallback to general resolution
    const fallbackUrl = this.resolveImageUrl(attachment);
    console.log('🔄 FALLBACK URL RESOLVED:', fallbackUrl);
    return fallbackUrl;
  }
}
