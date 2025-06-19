
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
      
      const provider = await this.getProvider();
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

  private static async getProvider() {
    // Try to get the API key from Supabase edge function
    try {
      const response = await fetch('/api/screenshot-config', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sb-okvsvrcphudxxrdonfvp-auth-token')}`
        }
      });
      
      if (response.ok) {
        const { apiKey } = await response.json();
        if (apiKey) {
          console.log('✅ Using ScreenshotOne API with configured key');
          return new ScreenshotOneProvider(apiKey);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch ScreenshotOne API key from server:', error);
    }

    // Fallback to environment variable (for development)
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey) {
      console.log('✅ Using ScreenshotOne API with environment key');
      return new ScreenshotOneProvider(envApiKey);
    }
    
    console.warn('⚠️ ScreenshotOne API key not found, using mock service');
    return new MockScreenshotProvider();
  }
}
