
import { ScreenshotCaptureOptions, ScreenshotResult, ScreenshotProvider } from './types';

export class MockScreenshotProvider implements ScreenshotProvider {
  async captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult> {
    console.log('🎭 MockScreenshotProvider: Simulating screenshot capture for:', url);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate mock screenshot URLs using placehold.co
    const deviceType = options.mobile ? 'mobile' : 'desktop';
    const width = options.width || (options.mobile ? 375 : 1920);
    const height = options.height || (options.mobile ? 812 : 1080);
    
    try {
      const hostname = new URL(url).hostname;
      const displayText = encodeURIComponent(`${deviceType.toUpperCase()}\nScreenshot\n${hostname}`);
      const thumbnailText = encodeURIComponent(`${deviceType}\n${hostname}`);
      
      // Use placehold.co service with proper encoding and /png format
      const mockScreenshotUrl = `https://placehold.co/${width}x${height}/f0f0f0/333333/png?text=${displayText}`;
      const mockThumbnailUrl = `https://placehold.co/400x300/f0f0f0/333333/png?text=${thumbnailText}`;
      
      console.log('🎭 MockScreenshotProvider: Generated mock URLs:', {
        screenshotUrl: mockScreenshotUrl,
        thumbnailUrl: mockThumbnailUrl
      });
      
      return {
        success: true,
        url,
        screenshotUrl: mockScreenshotUrl,
        thumbnailUrl: mockThumbnailUrl,
        metadata: {
          width: width,
          height: height,
          format: options.format || 'png',
          size: Math.floor(Math.random() * 500000) + 100000,
          capturedAt: new Date().toISOString(),
          deviceType: options.mobile ? 'mobile' : 'desktop'
        }
      };
    } catch (error) {
      console.error('🎭 MockScreenshotProvider: Error generating URLs:', error);
      
      // Fallback with simple text if URL parsing fails
      const fallbackText = encodeURIComponent(`${deviceType.toUpperCase()}\nScreenshot\nWebsite`);
      const mockScreenshotUrl = `https://placehold.co/${width}x${height}/f0f0f0/333333/png?text=${fallbackText}`;
      const mockThumbnailUrl = `https://placehold.co/400x300/f0f0f0/333333/png?text=${encodeURIComponent(`${deviceType}\nWebsite`)}`;
      
      return {
        success: true,
        url,
        screenshotUrl: mockScreenshotUrl,
        thumbnailUrl: mockThumbnailUrl,
        metadata: {
          width: width,
          height: height,
          format: options.format || 'png',
          size: 150000,
          capturedAt: new Date().toISOString(),
          deviceType: options.mobile ? 'mobile' : 'desktop'
        }
      };
    }
  }
}
