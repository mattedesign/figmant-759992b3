
import { Asset, ASSET_CATEGORIES } from '@/types/assets';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAssetOperation, replaceAssetOperation, deleteAssetOperation } from './operations';

export const useAssetOperations = () => {
  const { user } = useAuth();

  const uploadAsset = async (
    file: File,
    type: Asset['type'],
    category: Asset['category'] = ASSET_CATEGORIES.CONTENT,
    tags: string[] = []
  ): Promise<Asset | null> => {
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    return uploadAssetOperation(file, type, category, tags, user.id);
  };

  const replaceAsset = async (existingAsset: Asset, newFile: File): Promise<Asset | null> => {
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    return replaceAssetOperation(existingAsset, newFile, user.id);
  };

  const deleteAsset = async (asset: Asset): Promise<boolean> => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    return deleteAssetOperation(asset, user.id);
  };

  return {
    uploadAsset,
    replaceAsset,
    deleteAsset
  };
};
