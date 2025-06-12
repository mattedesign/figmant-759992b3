
import { useAssetOperations } from './asset-management/assetOperations';
import { useAssetState } from './asset-management/assetState';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const useAssetManagement = () => {
  const {
    assets,
    isLoading,
    setIsLoading,
    addAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory
  } = useAssetState();

  const { uploadAsset: uploadAssetOperation, deleteAsset: deleteAssetOperation } = useAssetOperations();

  const uploadAsset = async (
    file: File,
    type: Asset['type'],
    category: string = ASSET_CATEGORIES.CONTENT,
    tags: string[] = []
  ): Promise<Asset | null> => {
    setIsLoading(true);
    try {
      const asset = await uploadAssetOperation(file, type, category, tags);
      if (asset) {
        addAsset(asset);
      }
      return asset;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAsset = async (asset: Asset): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await deleteAssetOperation(asset);
      if (success) {
        removeAsset(asset.id);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assets,
    isLoading,
    uploadAsset,
    deleteAsset,
    getAssetsByType,
    getAssetsByCategory
  };
};
