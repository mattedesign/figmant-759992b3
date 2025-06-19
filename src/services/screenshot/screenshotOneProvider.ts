
import { ScreenshotCaptureOptions, ScreenshotResult, ScreenshotProvider } from './types';
import { SCREENSHOTONE_API_URL, MOBILE_VIEWPORT, THUMBNAIL_VIEWPORT } from './config';

export class ScreenshotOneProvider implements ScreenshotProvider {
  constructor(private apiKey: string) {}

  async captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult> {
    try {
      console.log('🔑 Using ScreenshotOne API for:', url);
      const screenshotData = await this.captureWithScreenshotOne(url, options);
      
      console.log('✅ ScreenshotOne capture successful for:', url);
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
      console.error('❌ ScreenshotOne capture failed for:', url, error);
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

    console.log('📸 ScreenshotOne API request URL:', screenshotUrl);
    console.log('📸 ScreenshotOne API thumbnail URL:', thumbnailUrl);
    
    // Return the URLs directly - the API will generate them when accessed
    console.log('✅ ScreenshotOne URLs generated successfully');
    
    return {
      screenshotUrl,
      thumbnailUrl,
      size: 100000 // Estimated size since we're not pre-fetching
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

    console.log('📸 ScreenshotOne API params:', Object.fromEntries(params.entries()));
    return params;
  }
}
