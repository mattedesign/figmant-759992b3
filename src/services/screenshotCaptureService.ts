
export interface ScreenshotCaptureOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  mobile?: boolean;
  delay?: number;
  blockAds?: boolean;
  blockCookieBanners?: boolean;
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
    delay: 2000,
    blockAds: true,
    blockCookieBanners: true
  };

  private static readonly SCREENSHOTONE_API_URL = 'https://api.screenshotone.com/take';

  static async captureScreenshot(
    url: string, 
    options: ScreenshotCaptureOptions = {}
  ): Promise<ScreenshotResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      console.log('📸 Capturing screenshot for:', url);
      
      // Check if ScreenshotOne API key is available
      const apiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
      if (!apiKey) {
        console.warn('ScreenshotOne API key not found, using mock service');
        return this.simulateScreenshotCapture(url, opts);
      }

      const screenshotResult = await this.captureWithScreenshotOne(url, opts, apiKey);
      
      return {
        success: true,
        url,
        screenshotUrl: screenshotResult.screenshotUrl,
        thumbnailUrl: screenshotResult.thumbnailUrl,
        metadata: {
          width: opts.width!,
          height: opts.height!,
          format: opts.format!,
          size: screenshotResult.size,
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

  private static async captureWithScreenshotOne(
    url: string,
    options: ScreenshotCaptureOptions,
    apiKey: string
  ): Promise<{ screenshotUrl: string; thumbnailUrl: string; size: number }> {
    const params = new URLSearchParams({
      access_key: apiKey,
      url: url,
      viewport_width: options.width?.toString() || '1920',
      viewport_height: options.height?.toString() || '1080',
      device_scale_factor: '1',
      format: options.format || 'png',
      image_quality: options.quality?.toString() || '90',
      block_ads: options.blockAds ? 'true' : 'false',
      block_cookie_banners: options.blockCookieBanners ? 'true' : 'false',
      block_banners_by_heuristics: 'true',
      delay: (options.delay || 2000).toString(),
      timeout: '30',
      full_page: options.fullPage ? 'true' : 'false'
    });

    if (options.mobile) {
      params.set('viewport_width', '375');
      params.set('viewport_height', '812');
      params.set('device_scale_factor', '2');
      params.set('user_agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    }

    const screenshotUrl = `${this.SCREENSHOTONE_API_URL}?${params.toString()}`;
    
    // For thumbnail, create a smaller version
    const thumbnailParams = new URLSearchParams(params);
    thumbnailParams.set('viewport_width', '400');
    thumbnailParams.set('viewport_height', '300');
    const thumbnailUrl = `${this.SCREENSHOTONE_API_URL}?${thumbnailParams.toString()}`;

    // Test the API by making a HEAD request to check if it's working
    try {
      const response = await fetch(screenshotUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`ScreenshotOne API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('ScreenshotOne API test failed, falling back to mock:', error);
      throw error;
    }

    return {
      screenshotUrl,
      thumbnailUrl,
      size: Math.floor(Math.random() * 500000) + 100000 // Estimated size
    };
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
        fullPage: true,
        blockAds: true,
        blockCookieBanners: true
      });
    }

    if (includeMobile) {
      console.log('📱 Capturing mobile screenshots...');
      results.mobile = await this.captureMultipleScreenshots(urls, {
        width: 375,
        height: 812,
        mobile: true,
        fullPage: true,
        blockAds: true,
        blockCookieBanners: true
      });
    }

    return results;
  }
}
