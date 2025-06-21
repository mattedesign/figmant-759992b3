
import { supabase } from '@/integrations/supabase/client';

export class ImageService {
  /**
   * Get a public URL for a file in the design-uploads bucket
   */
  static getPublicUrl(filePath: string): string {
    if (!filePath) return '';
    
    // If it's already a full URL, return as-is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    
    const { data } = supabase.storage
      .from('design-uploads')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Resolve the best available image URL for an attachment
   */
  static resolveImageUrl(attachment: any): string | null {
    if (!attachment) return null;

    // Try different URL properties in order of preference
    const urlCandidates = [
      attachment.thumbnailUrl,
      attachment.url,
      attachment.file_path,
      attachment.uploadPath
    ];

    for (const candidate of urlCandidates) {
      if (candidate && typeof candidate === 'string') {
        // If it's a storage path, convert to public URL
        if (!candidate.startsWith('http')) {
          return this.getPublicUrl(candidate);
        }
        return candidate;
      }
    }

    return null;
  }

  /**
   * Check if a URL is accessible by attempting to load it
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    if (!url) return false;
    
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
   * Get the best available image URL with fallback handling
   */
  static async getBestImageUrl(attachment: any): Promise<string | null> {
    const primaryUrl = this.resolveImageUrl(attachment);
    
    if (!primaryUrl) return null;
    
    // Test if the primary URL works
    const isValid = await this.validateImageUrl(primaryUrl);
    if (isValid) return primaryUrl;
    
    // If primary URL fails, try other options
    const fallbackUrls = [
      attachment.url,
      attachment.file_path,
      attachment.uploadPath
    ].filter(url => url && url !== primaryUrl);
    
    for (const fallbackUrl of fallbackUrls) {
      const resolvedUrl = fallbackUrl.startsWith('http') ? fallbackUrl : this.getPublicUrl(fallbackUrl);
      const isValid = await this.validateImageUrl(resolvedUrl);
      if (isValid) return resolvedUrl;
    }
    
    return null;
  }

  /**
   * Handle screenshot metadata and return best image URL
   */
  static getScreenshotUrl(attachment: any): string | null {
    // Check if we have screenshot data in metadata
    const hasDesktopScreenshot = attachment.metadata?.screenshots?.desktop?.success;
    const hasMobileScreenshot = attachment.metadata?.screenshots?.mobile?.success;
    
    if (hasDesktopScreenshot) {
      return attachment.metadata.screenshots.desktop.thumbnailUrl || attachment.metadata.screenshots.desktop.url;
    }
    
    if (hasMobileScreenshot) {
      return attachment.metadata.screenshots.mobile.thumbnailUrl || attachment.metadata.screenshots.mobile.url;
    }
    
    return null;
  }
}
