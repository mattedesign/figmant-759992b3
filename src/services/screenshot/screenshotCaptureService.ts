
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
      console.log('📸 SCREENSHOT SERVICE - Capturing screenshot for:', url, 'with options:', opts);
      
      const provider = await this.getProvider();
      const result = await provider.captureScreenshot(url, opts);
      
      console.log('📸 SCREENSHOT SERVICE - Result:', result);
      return result;
    } catch (error) {
      console.error('📸 SCREENSHOT SERVICE - Capture failed:', error);
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
    console.log('📸 SCREENSHOT SERVICE - Capturing multiple screenshots for:', urls.length, 'URLs');
    const capturePromises = urls.map(url => this.captureScreenshot(url, options));
    const results = await Promise.all(capturePromises);
    console.log('📸 SCREENSHOT SERVICE - Multiple capture results:', results);
    return results;
  }

  static async captureCompetitorSet(
    urls: string[],
    includeDesktop: boolean = true,
    includeMobile: boolean = true
  ): Promise<{ desktop?: ScreenshotResult[]; mobile?: ScreenshotResult[] }> {
    console.log('📸 SCREENSHOT SERVICE - Capturing competitor set:', {
      urls,
      includeDesktop,
      includeMobile
    });
    
    const results: { desktop?: ScreenshotResult[]; mobile?: ScreenshotResult[] } = {};

    if (includeDesktop) {
      console.log('📸 SCREENSHOT SERVICE - Capturing desktop screenshots...');
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
      console.log('📸 SCREENSHOT SERVICE - Capturing mobile screenshots...');
      results.mobile = await this.captureMultipleScreenshots(urls, {
        width: 375,
        height: 812,
        mobile: true,
        fullPage: true,
        blockAds: true,
        blockCookieBanners: true
      });
    }

    console.log('📸 SCREENSHOT SERVICE - Competitor set complete:', results);
    return results;
  }

  private static async getProvider() {
    console.log('📸 SCREENSHOT SERVICE - Getting provider...');
    
    // Try to get the API key from environment first (for development)
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey) {
      console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with environment key');
      return new ScreenshotOneProvider(envApiKey);
    }

    // Try to get the API key from Supabase edge function
    try {
      console.log('📸 SCREENSHOT SERVICE - Checking for API key from server...');
      const response = await fetch('/api/screenshot-config');
      
      if (response.ok) {
        const { apiKey } = await response.json();
        if (apiKey) {
          console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with server key');
          return new ScreenshotOneProvider(apiKey);
        }
      }
      console.log('⚠️ SCREENSHOT SERVICE - No API key from server, response status:', response.status);
    } catch (error) {
      console.warn('⚠️ SCREENSHOT SERVICE - Failed to fetch API key from server:', error);
    }
    
    console.warn('⚠️ SCREENSHOT SERVICE - No API key found, using mock service');
    return new MockScreenshotProvider();
  }

  // Method to test the service connectivity
  static async testService(): Promise<{ isWorking: boolean; provider: string; error?: string }> {
    try {
      console.log('🧪 SCREENSHOT SERVICE - Testing service...');
      const provider = await this.getProvider();
      
      if (provider instanceof MockScreenshotProvider) {
        return { isWorking: true, provider: 'mock' };
      }
      
      // Test with a simple URL
      const testResult = await provider.captureScreenshot('https://google.com', {
        width: 800,
        height: 600,
        mobile: false
      });
      
      return { 
        isWorking: testResult.success, 
        provider: 'screenshotone',
        error: testResult.success ? undefined : testResult.error
      };
    } catch (error) {
      console.error('🧪 SCREENSHOT SERVICE - Test failed:', error);
      return { 
        isWorking: false, 
        provider: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
