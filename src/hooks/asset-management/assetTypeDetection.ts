
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const determineAssetType = (fileName: string, filePath: string): Asset['type'] => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
    // Check if it's specifically a logo based on path or filename
    if (filePath.includes('/logo/') || fileName.toLowerCase().includes('logo')) {
      return 'logo';
    } else {
      return 'image';
    }
  } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension || '')) {
    return 'video';
  } else if (['pdf'].includes(extension || '')) {
    return 'document';
  }
  
  return 'other';
};

export const determineAssetCategory = (filePath: string): Asset['category'] => {
  if (filePath.includes('branding/') || filePath.includes('/logo/')) {
    return ASSET_CATEGORIES.BRANDING;
  } else if (filePath.includes('system/')) {
    return ASSET_CATEGORIES.SYSTEM;
  }
  
  return ASSET_CATEGORIES.CONTENT;
};

export const determineMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const mimeMap: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'pdf': 'application/pdf'
  };
  
  return mimeMap[extension || ''] || 'application/octet-stream';
};
