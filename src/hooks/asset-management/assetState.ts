
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const useAssetState = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { logoConfig } = useLogoConfig();

  // Load existing assets on mount
  useEffect(() => {
    if (user) {
      loadExistingAssets();
    }
  }, [user, logoConfig]);

  const loadExistingAssets = async () => {
    if (!user) return;

    try {
      console.log('Loading existing assets...');
      
      // If we have a logo configuration that's not the default, create a mock asset
      if (logoConfig.activeLogoUrl && logoConfig.activeLogoUrl.includes('supabase')) {
        const mockAsset: Asset = {
          id: 'current-logo',
          name: 'Current Active Logo',
          type: 'logo',
          category: ASSET_CATEGORIES.BRANDING,
          url: logoConfig.activeLogoUrl,
          uploadPath: logoConfig.activeLogoUrl,
          fileSize: 0,
          mimeType: 'image/png',
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.id,
          tags: ['main-logo'],
          isActive: true
        };
        setAssets([mockAsset]);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error('Failed to load existing assets:', error);
    }
  };

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => {
      // Remove any existing logo assets if this is a new logo
      if (asset.type === 'logo') {
        return [asset, ...prev.filter(a => a.type !== 'logo')];
      }
      return [asset, ...prev];
    });
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
  }, []);

  const getAssetsByType = useCallback((type: Asset['type']) => {
    return assets.filter(asset => asset.type === type && asset.isActive);
  }, [assets]);

  const getAssetsByCategory = useCallback((category: string) => {
    return assets.filter(asset => asset.category === category && asset.isActive);
  }, [assets]);

  return {
    assets,
    isLoading,
    setIsLoading,
    addAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory,
    loadExistingAssets
  };
};
