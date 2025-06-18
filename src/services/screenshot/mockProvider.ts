
import { ScreenshotCaptureOptions, ScreenshotResult, ScreenshotProvider } from './types';

export class MockScreenshotProvider implements ScreenshotProvider {
  async captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, options.delay || 2000));
    
    const hostname = new URL(url).hostname;
    
    // Generate mock screenshot URLs
    const timestamp = Date.now();
    const screenshotUrl = `https://screenshots.figmant.ai/${hostname}/full-${timestamp}.${options.format}`;
    const thumbnailUrl = `https://screenshots.figmant.ai/${hostname}/thumb-${timestamp}.${options.format}`;
    
    return {
      success: true,
      url,
      screenshotUrl,
      thumbnailUrl,
      metadata: {
        width: options.width!,
        height: options.height!,
        format: options.format!,
        size: Math.floor(Math.random() * 500000) + 100000,
        capturedAt: new Date().toISOString(),
        deviceType: options.mobile ? 'mobile' : 'desktop'
      }
    };
  }
}
