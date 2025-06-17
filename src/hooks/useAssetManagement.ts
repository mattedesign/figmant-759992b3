
import { useAssetOperations } from './asset-management/assetOperations';
import { useAssetState } from './asset-management/useAssetState';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const useAssetManagement = () => {
  const {
    assets,
    isLoading,
    setIsLoading,
    addAsset,
    removeAsset,
    updateAsset,
    getAssetsByType,
    getAssetsByCategory
  } = useAssetState();

  const { uploadAsset: uploadAssetOperation, replaceAsset: replaceAssetOperation, deleteAsset: deleteAssetOperation } = useAssetOperations();

  const uploadAsset = async (
    file: File,
    type: Asset['type'],
    category: Asset['category'] = ASSET_CATEGORIES.CONTENT,
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

  const replaceAsset = async (existingAsset: Asset, newFile: File): Promise<Asset | null> => {
    setIsLoading(true);
    try {
      const updatedAsset = await replaceAssetOperation(existingAsset, newFile);
      if (updatedAsset) {
        updateAsset(updatedAsset);
      }
      return updatedAsset;
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
    replaceAsset,
    deleteAsset,
    getAssetsByType,
    getAssetsByCategory
  };
};
