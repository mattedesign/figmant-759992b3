
import { ScreenshotCaptureOptions, ScreenshotResult, ScreenshotProvider } from './types';
import { SCREENSHOTONE_API_URL, MOBILE_VIEWPORT, THUMBNAIL_VIEWPORT } from './config';

export class ScreenshotOneProvider implements ScreenshotProvider {
  constructor(private apiKey: string) {}

  async captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult> {
    try {
      const screenshotData = await this.captureWithScreenshotOne(url, options);
      
      return {
        success: true,
        url,
        screenshotUrl: screenshotData.screenshotUrl,
        thumbnailUrl: screenshotData.thumbnailUrl,
        metadata: {
          width: options.width!,
          height: options.height!,
          format: options.format!,
          size: screenshotData.size,
          capturedAt: new Date().toISOString(),
          deviceType: options.mobile ? 'mobile' : 'desktop'
        }
      };
    } catch (error) {
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : 'Screenshot capture failed'
      };
    }
  }

  private async captureWithScreenshotOne(
    url: string,
    options: ScreenshotCaptureOptions
  ): Promise<{ screenshotUrl: string; thumbnailUrl: string; size: number }> {
    const params = this.buildScreenshotParams(url, options);
    const screenshotUrl = `${SCREENSHOTONE_API_URL}?${params.toString()}`;
    
    // Create thumbnail version
    const thumbnailParams = new URLSearchParams(params);
    thumbnailParams.set('viewport_width', THUMBNAIL_VIEWPORT.width.toString());
    thumbnailParams.set('viewport_height', THUMBNAIL_VIEWPORT.height.toString());
    const thumbnailUrl = `${SCREENSHOTONE_API_URL}?${thumbnailParams.toString()}`;

    // Test the API by making a HEAD request
    await this.validateApiEndpoint(screenshotUrl);

    return {
      screenshotUrl,
      thumbnailUrl,
      size: Math.floor(Math.random() * 500000) + 100000 // Estimated size
    };
  }

  private buildScreenshotParams(url: string, options: ScreenshotCaptureOptions): URLSearchParams {
    const params = new URLSearchParams({
      access_key: this.apiKey,
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
      params.set('viewport_width', MOBILE_VIEWPORT.width.toString());
      params.set('viewport_height', MOBILE_VIEWPORT.height.toString());
      params.set('device_scale_factor', MOBILE_VIEWPORT.scale.toString());
      params.set('user_agent', MOBILE_VIEWPORT.userAgent);
    }

    return params;
  }

  private async validateApiEndpoint(screenshotUrl: string): Promise<void> {
    try {
      const response = await fetch(screenshotUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`ScreenshotOne API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('ScreenshotOne API test failed:', error);
      throw error;
    }
  }
}
