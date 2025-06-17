
import { useState, useCallback } from 'react';
import { Asset } from '@/types/assets';

export const useAssetStore = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => {
      // Remove any existing logo assets if this is a new logo
      if (asset.type === 'logo') {
        return [asset, ...prev.filter(a => a.type !== 'logo')];
      }
      return [asset, ...prev];
    });
  }, []);

  const updateAsset = useCallback((updatedAsset: Asset) => {
    setAssets(prev => prev.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ));
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
    setAssets,
    isLoading,
    setIsLoading,
    addAsset,
    updateAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory
  };
};
