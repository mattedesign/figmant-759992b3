
import { ScreenshotCaptureOptions, ScreenshotResult } from './types';
import { DEFAULT_OPTIONS } from './config';
import { ScreenshotOneProvider } from './screenshotOneProvider';
import { MockScreenshotProvider } from './mockProvider';
import { supabase } from '@/integrations/supabase/client';

export class ScreenshotCaptureService {
  private static apiKeyStatus: 'unchecked' | 'valid' | 'invalid' | 'missing' = 'unchecked';
  private static lastErrorMessage: string | null = null;
  private static cachedApiKey: string | null = null;
  private static apiKeySource: 'server' | 'environment' | 'none' = 'none';

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

  private static async fetchApiKeyFromServer(): Promise<string | null> {
    try {
      console.log('🔑 SCREENSHOT SERVICE - Attempting to fetch API key from Supabase...');
      
      const { data, error } = await supabase.functions.invoke('screenshot-config');
      
      if (error) {
        console.warn('🔑 SCREENSHOT SERVICE - Supabase function error:', error);
        return null;
      }
      
      if (data?.apiKey) {
        console.log('✅ SCREENSHOT SERVICE - API key retrieved from Supabase');
        this.apiKeySource = 'server';
        return data.apiKey;
      }
      
      console.log('⚠️ SCREENSHOT SERVICE - No API key found in Supabase response');
      return null;
    } catch (error) {
      console.warn('🔑 SCREENSHOT SERVICE - Failed to fetch from Supabase:', error);
      return null;
    }
  }

  private static async getProvider() {
    console.log('📸 SCREENSHOT SERVICE - Getting provider...');
    
    // Try to get API key from cache first
    if (!this.cachedApiKey) {
      // Try Supabase secrets first
      this.cachedApiKey = await this.fetchApiKeyFromServer();
      
      // Fallback to environment variable if Supabase fails
      if (!this.cachedApiKey) {
        const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
        if (envApiKey && envApiKey.trim()) {
          console.log('✅ SCREENSHOT SERVICE - Using environment API key as fallback');
          this.cachedApiKey = envApiKey;
          this.apiKeySource = 'environment';
        }
      }
    }
    
    if (this.cachedApiKey && this.cachedApiKey.trim()) {
      console.log(`✅ SCREENSHOT SERVICE - Using ScreenshotOne API with ${this.apiKeySource} key`);
      this.apiKeyStatus = 'valid';
      return new ScreenshotOneProvider(this.cachedApiKey);
    }
    
    console.warn('⚠️ SCREENSHOT SERVICE - No API key found, using mock service');
    this.apiKeyStatus = 'missing';
    this.apiKeySource = 'none';
    this.lastErrorMessage = 'ScreenshotOne API key not configured. Configure via Supabase secrets or add VITE_SCREENSHOTONE_API_KEY to environment variables.';
    return new MockScreenshotProvider();
  }

  // Enhanced service status method
  static async getServiceStatus(): Promise<{ 
    isWorking: boolean; 
    provider: string; 
    apiKeyStatus: string;
    apiKeySource: string;
    error?: string;
    hasApiKey: boolean;
    setupInstructions?: string;
  }> {
    try {
      const provider = await this.getProvider();
      const providerName = provider.constructor.name;
      
      // Check if we have an API key configured
      const hasApiKey = !!(this.cachedApiKey && this.cachedApiKey.trim());
      
      if (!hasApiKey && providerName === 'MockScreenshotProvider') {
        return {
          isWorking: false,
          provider: providerName,
          apiKeyStatus: this.apiKeyStatus,
          apiKeySource: this.apiKeySource,
          hasApiKey: false,
          error: 'No API key configured',
          setupInstructions: 'Configure API key via Supabase secrets or add VITE_SCREENSHOTONE_API_KEY to your environment variables to enable screenshot capture.'
        };
      }
      
      return {
        isWorking: hasApiKey,
        provider: providerName,
        apiKeyStatus: this.apiKeyStatus,
        apiKeySource: this.apiKeySource,
        hasApiKey: hasApiKey,
        error: this.lastErrorMessage
      };
    } catch (error) {
      return {
        isWorking: false,
        provider: 'unknown',
        apiKeyStatus: this.apiKeyStatus,
        apiKeySource: this.apiKeySource,
        hasApiKey: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test service method for debugger component
  static async testService(): Promise<{ isWorking: boolean; provider: string; apiKeySource: string; error?: string }> {
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
        apiKeySource: this.apiKeySource,
        error: testResult.error
      };
    } catch (error) {
      return {
        isWorking: false,
        provider: 'unknown',
        apiKeySource: this.apiKeySource,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current API key status without testing
  static async getApiKeyStatus(): Promise<{
    status: string;
    hasKey: boolean;
    source: string;
    lastError: string | null;
  }> {
    // Ensure we have checked for API key
    if (!this.cachedApiKey && this.apiKeyStatus === 'unchecked') {
      await this.getProvider();
    }
    
    const hasKey = !!(this.cachedApiKey && this.cachedApiKey.trim());
    
    return {
      status: this.apiKeyStatus,
      hasKey,
      source: this.apiKeySource,
      lastError: this.lastErrorMessage
    };
  }

  // Reset status and cache (useful for testing)
  static resetStatus(): void {
    this.apiKeyStatus = 'unchecked';
    this.lastErrorMessage = null;
    this.cachedApiKey = null;
    this.apiKeySource = 'none';
  }
}
