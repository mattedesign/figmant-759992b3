
import { ScreenshotCaptureOptions } from './types';

export const DEFAULT_OPTIONS: ScreenshotCaptureOptions = {
  width: 1920,
  height: 1080,
  fullPage: false,
  quality: 90,
  format: 'png',
  mobile: false,
  delay: 2000,
  blockAds: true,
  blockCookieBanners: true
};

export const SCREENSHOTONE_API_URL = 'https://api.screenshotone.com/take';

export const MOBILE_VIEWPORT = {
  width: 375,
  height: 812,
  scale: 2,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
};

export const THUMBNAIL_VIEWPORT = {
  width: 400,
  height: 300
};
