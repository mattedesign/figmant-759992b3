
import { ScreenshotCaptureOptions, ScreenshotResult, ScreenshotProvider } from './types';

export class MockScreenshotProvider implements ScreenshotProvider {
  async captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult> {
    console.log('🎭 MockScreenshotProvider: Simulating screenshot capture for:', url);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate mock screenshot URLs (using placeholder service)
    const deviceType = options.mobile ? 'mobile' : 'desktop';
    const width = options.width || (options.mobile ? 375 : 1920);
    const height = options.height || (options.mobile ? 812 : 1080);
    
    // Use a placeholder service that can generate screenshots
    const mockScreenshotUrl = `https://via.placeholder.com/${width}x${height}/f0f0f0/333333?text=${encodeURIComponent(`${deviceType.toUpperCase()}\nScreenshot\n${new URL(url).hostname}`)}`;
    const mockThumbnailUrl = `https://via.placeholder.com/400x300/f0f0f0/333333?text=${encodeURIComponent(`${deviceType}\n${new URL(url).hostname}`)}`;
    
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
  }
}
