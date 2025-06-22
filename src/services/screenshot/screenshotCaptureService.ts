
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
      console.log('📸 SCREENSHOT SERVICE - Using provider:', provider.constructor.name);
      
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
        blockCookieBanners: true,
        delay: 3
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
        blockCookieBanners: true,
        delay: 3
      });
    }

    console.log('📸 SCREENSHOT SERVICE - Competitor set complete:', results);
    return results;
  }

  private static async getProvider() {
    console.log('📸 SCREENSHOT SERVICE - Getting provider...');
    
    // Check for environment variable first
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey) {
      console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with environment key');
      return new ScreenshotOneProvider(envApiKey);
    }
    
    // Try Supabase approach
    try {
      console.log('📸 SCREENSHOT SERVICE - Checking for API key from Supabase...');
      
      const response = await fetch('/api/screenshot-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📸 SCREENSHOT SERVICE - Server response status:', response.status);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('📸 SCREENSHOT SERVICE - Server response received');
        
        try {
          const data = JSON.parse(responseText);
          if (data.apiKey) {
            console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with Supabase key');
            return new ScreenshotOneProvider(data.apiKey);
          }
        } catch (parseError) {
          console.error('📸 SCREENSHOT SERVICE - Failed to parse server response:', parseError);
        }
      } else {
        console.warn('📸 SCREENSHOT SERVICE - Server returned error status:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ SCREENSHOT SERVICE - Failed to fetch API key from Supabase:', error);
    }
    
    console.warn('⚠️ SCREENSHOT SERVICE - No API key found, using mock service');
    throw new Error('ScreenshotOne API key not configured. Please add VITE_SCREENSHOTONE_API_KEY to your environment variables or configure it in Supabase.');
  }

  // Method to test the service connectivity
  static async testService(): Promise<{ isWorking: boolean; provider: string; error?: string }> {
    try {
      const provider = await this.getProvider();
      const providerName = provider.constructor.name;
      
      // Test with a simple URL
      const testResult = await provider.captureScreenshot('https://example.com', {
        width: 800,
        height: 600,
        format: 'png'
      });
      
      return {
        isWorking: testResult.success,
        provider: providerName,
        error: testResult.error
      };
    } catch (error) {
      return {
        isWorking: false,
        provider: 'MockScreenshotProvider',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Method to check if service is properly configured
  static async isConfigured(): Promise<{ configured: boolean; source?: string; error?: string }> {
    try {
      // Check environment variable
      const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
      if (envApiKey) {
        return { configured: true, source: 'environment' };
      }

      // Check Supabase
      try {
        const response = await fetch('/api/screenshot-config', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.apiKey) {
            return { configured: true, source: 'supabase' };
          }
        }
      } catch (supabaseError) {
        console.warn('Supabase API key check failed:', supabaseError);
      }

      return { 
        configured: false, 
        error: 'ScreenshotOne API key not found in environment variables or Supabase configuration' 
      };
    } catch (error) {
      return { 
        configured: false, 
        error: error instanceof Error ? error.message : 'Configuration check failed' 
      };
    }
  }
}
