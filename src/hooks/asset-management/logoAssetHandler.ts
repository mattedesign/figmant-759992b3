
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

interface LogoConfig {
  activeLogoUrl?: string;
  collapsedLogoUrl?: string;
}

export const createLogoAssets = (logoConfig: LogoConfig, userId: string): Asset[] => {
  const logoAssets: Asset[] = [];

  // Add active logo if it exists and is a Supabase URL
  if (logoConfig.activeLogoUrl && logoConfig.activeLogoUrl.includes('supabase')) {
    const mockLogoAsset: Asset = {
      id: 'current-active-logo',
      name: 'Current Active Logo',
      type: 'logo',
      category: ASSET_CATEGORIES.BRANDING,
      url: logoConfig.activeLogoUrl,
      uploadPath: logoConfig.activeLogoUrl,
      fileSize: 0,
      mimeType: 'image/png',
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
      tags: ['active-logo', 'branding'],
      isActive: true
    };
    logoAssets.push(mockLogoAsset);
  }

  // Add collapsed logo if it exists and is different
  if (logoConfig.collapsedLogoUrl && logoConfig.collapsedLogoUrl.includes('supabase')) {
    const mockCollapsedAsset: Asset = {
      id: 'current-collapsed-logo',
      name: 'Current Collapsed Logo',
      type: 'logo',
      category: ASSET_CATEGORIES.BRANDING,
      url: logoConfig.collapsedLogoUrl,
      uploadPath: logoConfig.collapsedLogoUrl,
      fileSize: 0,
      mimeType: 'image/svg+xml',
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
      tags: ['collapsed-logo', 'branding'],
      isActive: true
    };
    logoAssets.push(mockCollapsedAsset);
  }

  return logoAssets;
};

export const checkIfLogoExists = (logoAssets: Asset[], logoUrl: string): boolean => {
  return logoAssets.some(asset => asset.url === logoUrl);
};
