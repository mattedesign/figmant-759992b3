
import { ScreenshotCaptureOptions, ScreenshotResult } from './types';
import { DEFAULT_OPTIONS } from './config';
import { ScreenshotOneProvider } from './screenshotOneProvider';
import { MockScreenshotProvider } from './mockProvider';

export class ScreenshotCaptureService {
  static async captureScreenshot(
    url: string, 
    options: ScreenshotCaptureOptions = {}
  ): Promise<ScreenshotResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    try {
      console.log('📸 Capturing screenshot for:', url);
      
      const provider = this.getProvider();
      return await provider.captureScreenshot(url, opts);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : 'Screenshot capture failed'
      };
    }
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

  private static getProvider() {
    const apiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    
    if (!apiKey) {
      console.warn('ScreenshotOne API key not found, using mock service');
      return new MockScreenshotProvider();
    }
    
    return new ScreenshotOneProvider(apiKey);
  }
}
