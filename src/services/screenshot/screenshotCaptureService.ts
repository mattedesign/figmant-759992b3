
import { ScreenshotCaptureOptions, ScreenshotResult } from './types';
import { DEFAULT_OPTIONS } from './config';
import { ScreenshotOneProvider } from './screenshotOneProvider';
import { MockScreenshotProvider } from './mockProvider';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Try to get the API key from Supabase edge function first
    try {
      console.log('📸 SCREENSHOT SERVICE - Checking for API key from Supabase secrets...');
      
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      
      console.log('📸 SCREENSHOT SERVICE - Auth token available:', !!authToken);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add Authorization header if we have a token
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        console.log('📸 SCREENSHOT SERVICE - Added Authorization header');
      }
      
      const response = await fetch('/api/screenshot-config', { headers });
      
      console.log('📸 SCREENSHOT SERVICE - API response status:', response.status);
      console.log('📸 SCREENSHOT SERVICE - API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('📸 SCREENSHOT SERVICE - Parsed JSON response:', responseData);
        } else {
          const textResponse = await response.text();
          console.log('📸 SCREENSHOT SERVICE - Non-JSON response:', textResponse);
          throw new Error('Invalid response format from screenshot-config endpoint');
        }
        
        if (responseData && responseData.apiKey) {
          console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with Supabase secrets');
          return new ScreenshotOneProvider(responseData.apiKey);
        } else {
          console.log('⚠️ SCREENSHOT SERVICE - No API key in response data:', responseData);
        }
      } else {
        const errorText = await response.text();
        console.log('⚠️ SCREENSHOT SERVICE - API error response:', errorText);
        console.log('⚠️ SCREENSHOT SERVICE - No API key from Supabase secrets, response status:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ SCREENSHOT SERVICE - Failed to fetch API key from Supabase:', error);
      console.warn('⚠️ SCREENSHOT SERVICE - Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }

    // Fallback to environment variable (for development)
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey) {
      console.log('✅ SCREENSHOT SERVICE - Using ScreenshotOne API with environment key');
      return new ScreenshotOneProvider(envApiKey);
    }
    
    console.warn('⚠️ SCREENSHOT SERVICE - No API key found, using mock service');
    return new MockScreenshotProvider();
  }

  // Method to test the service connectivity
  static async testService(): Promise<{ 
    isWorking: boolean; 
    provider: string; 
    error?: string;
    details?: {
      authTokenAvailable: boolean;
      supabaseResponseStatus?: number;
      supabaseError?: string;
      envKeyAvailable: boolean;
    }
  }> {
    try {
      console.log('🧪 SCREENSHOT SERVICE - Testing service...');
      
      const testDetails = {
        authTokenAvailable: false,
        supabaseResponseStatus: undefined as number | undefined,
        supabaseError: undefined as string | undefined,
        envKeyAvailable: !!import.meta.env.VITE_SCREENSHOTONE_API_KEY
      };
      
      // Check auth token availability
      const { data: { session } } = await supabase.auth.getSession();
      testDetails.authTokenAvailable = !!session?.access_token;
      
      // Test Supabase endpoint
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        
        const response = await fetch('/api/screenshot-config', { headers });
        testDetails.supabaseResponseStatus = response.status;
        
        if (!response.ok) {
          testDetails.supabaseError = await response.text();
        }
      } catch (supabaseError) {
        testDetails.supabaseError = supabaseError instanceof Error ? supabaseError.message : 'Unknown Supabase error';
      }
      
      const provider = await this.getProvider();
      
      if (provider instanceof MockScreenshotProvider) {
        return { 
          isWorking: true, 
          provider: 'mock',
          details: testDetails
        };
      }
      
      // Test with a simple URL
      console.log('🧪 SCREENSHOT SERVICE - Testing with google.com...');
      const testResult = await provider.captureScreenshot('https://google.com', {
        width: 800,
        height: 600,
        mobile: false
      });
      
      console.log('🧪 SCREENSHOT SERVICE - Test result:', testResult);
      
      return { 
        isWorking: testResult.success, 
        provider: 'screenshotone',
        error: testResult.success ? undefined : testResult.error,
        details: testDetails
      };
    } catch (error) {
      console.error('🧪 SCREENSHOT SERVICE - Test failed:', error);
      return { 
        isWorking: false, 
        provider: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          authTokenAvailable: false,
          envKeyAvailable: !!import.meta.env.VITE_SCREENSHOTONE_API_KEY
        }
      };
    }
  }
}
