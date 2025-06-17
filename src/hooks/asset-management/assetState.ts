
import { useAssetStore } from './useAssetStore';
import { useAssetLoader } from './useAssetLoader';

export const useAssetState = () => {
  const {
    assets,
    setAssets,
    isLoading,
    setIsLoading,
    addAsset,
    updateAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory
  } = useAssetStore();

  const { loadExistingAssets } = useAssetLoader({
    setAssets,
    setIsLoading
  });

  return {
    assets,
    isLoading,
    setIsLoading,
    addAsset,
    updateAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory,
    loadExistingAssets
  };
};
