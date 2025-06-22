
import { ScreenshotCaptureOptions, ScreenshotResult } from './types';
import { DEFAULT_OPTIONS } from './config';
import { ScreenshotOneProvider } from './screenshotOneProvider';
import { MockScreenshotProvider } from './mockProvider';

export class ScreenshotCaptureService {
  private static apiKeyStatus: 'unchecked' | 'valid' | 'invalid' | 'missing' = 'unchecked';
  private static lastErrorMessage: string | null = null;

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
      
      // Update API key status based on result
      if (result.success) {
        this.apiKeyStatus = 'valid';
        this.lastErrorMessage = null;
      } else if (result.error?.includes('API key') || result.error?.includes('authentication')) {
        this.apiKeyStatus = 'invalid';
        this.lastErrorMessage = result.error;
      }
      
      return result;
    } catch (error) {
      console.error('📸 SCREENSHOT SERVICE - Capture failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Screenshot capture failed';
      this.lastErrorMessage = errorMessage;
      
      // Check if error is API key related
      if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
        this.apiKeyStatus = 'invalid';
      }
      
      return {
        success: false,
        url,
        error: errorMessage
      };
    }
  }

  static async captureMultipleScreenshots(
    urls: string[],
    options: ScreenshotCaptureOptions = {}
  ): Promise<ScreenshotResult[]> {
    console.log('📸 SCREENSHOT SERVICE - Capturing multiple screenshots for:', urls.length, 'URLs');
    
    // Check service status first
    const status = await this.getServiceStatus();
    if (!status.isWorking && status.provider === 'MockScreenshotProvider') {
      console.warn('📸 SCREENSHOT SERVICE - Using mock provider, results will be simulated');
    }
    
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
    
    // Check service status before proceeding
    const status = await this.getServiceStatus();
    console.log('📸 SCREENSHOT SERVICE - Service status:', status);
    
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
    
    // Check environment variable first
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey && envApiKey.trim()) {
      console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with environment key');
      this.apiKeyStatus = 'valid';
      return new ScreenshotOneProvider(envApiKey);
    }
    
    // Try Supabase approach (fallback)
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
          if (data.apiKey && data.apiKey.trim()) {
            console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with Supabase key');
            this.apiKeyStatus = 'valid';
            return new ScreenshotOneProvider(data.apiKey);
          }
        } catch (parseError) {
          console.error('📸 SCREENSHOT SERVICE - Failed to parse server response:', parseError);
        }
      } else {
        const responseText = await response.text();
        console.log('📸 SCREENSHOT SERVICE - Server error response:', responseText);
      }
    } catch (error) {
      console.warn('⚠️ SCREENSHOT SERVICE - Failed to fetch API key from Supabase:', error);
    }
    
    console.warn('⚠️ SCREENSHOT SERVICE - No API key found, using mock service');
    this.apiKeyStatus = 'missing';
    this.lastErrorMessage = 'ScreenshotOne API key not configured. Add VITE_SCREENSHOTONE_API_KEY to environment variables.';
    return new MockScreenshotProvider();
  }

  // Enhanced service status method
  static async getServiceStatus(): Promise<{ 
    isWorking: boolean; 
    provider: string; 
    apiKeyStatus: string;
    error?: string;
    hasApiKey: boolean;
    setupInstructions?: string;
  }> {
    try {
      const provider = await this.getProvider();
      const providerName = provider.constructor.name;
      
      // Check if we have an API key configured
      const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
      const hasApiKey = !!(envApiKey && envApiKey.trim());
      
      if (!hasApiKey && providerName === 'MockScreenshotProvider') {
        return {
          isWorking: false,
          provider: providerName,
          apiKeyStatus: this.apiKeyStatus,
          hasApiKey: false,
          error: 'No API key configured',
          setupInstructions: 'Add VITE_SCREENSHOTONE_API_KEY to your environment variables to enable screenshot capture.'
        };
      }
      
      // Test with a simple URL if we have an API key
      if (hasApiKey) {
        const testResult = await provider.captureScreenshot('https://example.com', {
          width: 400,
          height: 300,
          format: 'png'
        });
        
        return {
          isWorking: testResult.success,
          provider: providerName,
          apiKeyStatus: this.apiKeyStatus,
          hasApiKey: true,
          error: testResult.error
        };
      }
      
      return {
        isWorking: false,
        provider: providerName,
        apiKeyStatus: this.apiKeyStatus,
        hasApiKey: false,
        error: this.lastErrorMessage || 'Service not configured'
      };
    } catch (error) {
      return {
        isWorking: false,
        provider: 'unknown',
        apiKeyStatus: this.apiKeyStatus,
        hasApiKey: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current API key status without testing
  static getApiKeyStatus(): {
    status: string;
    hasKey: boolean;
    lastError: string | null;
  } {
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    const hasKey = !!(envApiKey && envApiKey.trim());
    
    return {
      status: this.apiKeyStatus,
      hasKey,
      lastError: this.lastErrorMessage
    };
  }

  // Reset status (useful for testing)
  static resetStatus(): void {
    this.apiKeyStatus = 'unchecked';
    this.lastErrorMessage = null;
  }
}
