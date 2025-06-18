
export interface ScreenshotCaptureOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  mobile?: boolean;
  delay?: number;
  blockAds?: boolean;
  blockCookieBanners?: boolean;
}

export interface ScreenshotResult {
  success: boolean;
  url: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
    capturedAt: string;
    deviceType: 'desktop' | 'mobile';
  };
  error?: string;
}

export interface ScreenshotProvider {
  captureScreenshot(url: string, options: ScreenshotCaptureOptions): Promise<ScreenshotResult>;
}
