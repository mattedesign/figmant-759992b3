
export interface ScreenshotCaptureOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  mobile?: boolean;
  delay?: number;
}

export interface ScreenshotResult {
  success: boolean;
  url: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    capturedAt: string;
    deviceType: 'desktop' | 'mobile';
  };
  error?: string;
}

export class ScreenshotCaptureService {
  private static readonly DEFAULT_OPTIONS: ScreenshotCaptureOptions = {
    width: 1920,
    height: 1080,
    fullPage: false,
    quality: 90,
    format: 'png',
    mobile: false,
    delay: 2000
  };

  static async captureScreenshot(
    url: string, 
    options: ScreenshotCaptureOptions = {}
  ): Promise<ScreenshotResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      console.log('📸 Capturing screenshot for:', url);
      
      // In a real implementation, this would call a screenshot service
      // For now, we'll simulate the capture process
      const mockScreenshotResult = await this.simulateScreenshotCapture(url, opts);
      
      return {
        success: true,
        url,
        screenshotUrl: mockScreenshotResult.screenshotUrl,
        thumbnailUrl: mockScreenshotResult.thumbnailUrl,
        metadata: {
          width: opts.width!,
          height: opts.height!,
          format: opts.format!,
          size: mockScreenshotResult.size,
          capturedAt: new Date().toISOString(),
          deviceType: opts.mobile ? 'mobile' : 'desktop'
        }
      };
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : 'Screenshot capture failed'
      };
    }
  }

  private static async simulateScreenshotCapture(
    url: string, 
    options: ScreenshotCaptureOptions
  ): Promise<{ screenshotUrl: string; thumbnailUrl: string; size: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, options.delay || 2000));
    
    const hostname = new URL(url).hostname;
    
    // Generate mock screenshot URLs (in production, these would be real screenshot URLs)
    const timestamp = Date.now();
    const screenshotUrl = `https://screenshots.figmant.ai/${hostname}/full-${timestamp}.${options.format}`;
    const thumbnailUrl = `https://screenshots.figmant.ai/${hostname}/thumb-${timestamp}.${options.format}`;
    
    return {
      screenshotUrl,
      thumbnailUrl,
      size: Math.floor(Math.random() * 500000) + 100000 // Mock file size
    };
  }

  static async captureMultipleScreenshots(
    urls: string[],
    options: ScreenshotCaptureOptions = {}
  ): Promise<ScreenshotResult[]> {
    const capturePromises = urls.map(url => this.captureScreenshot(url, options));
    return Promise.all(capturePromises);
  }

  static async captureCompetitorSet(
    urls: string[],
    includeDesktop: boolean = true,
    includeMobile: boolean = true
  ): Promise<{ desktop?: ScreenshotResult[]; mobile?: ScreenshotResult[] }> {
    const results: { desktop?: ScreenshotResult[]; mobile?: ScreenshotResult[] } = {};

    if (includeDesktop) {
      console.log('📸 Capturing desktop screenshots...');
      results.desktop = await this.captureMultipleScreenshots(urls, {
        width: 1920,
        height: 1080,
        mobile: false,
        fullPage: true
      });
    }

    if (includeMobile) {
      console.log('📱 Capturing mobile screenshots...');
      results.mobile = await this.captureMultipleScreenshots(urls, {
        width: 375,
        height: 812,
        mobile: true,
        fullPage: true
      });
    }

    return results;
  }
}
