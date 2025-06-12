
import { Asset } from '@/types/assets';

export interface AssetUploadResult {
  success: boolean;
  asset?: Asset;
  error?: string;
}

export interface AssetDeleteResult {
  success: boolean;
  error?: string;
}

export interface AssetManagementState {
  assets: Asset[];
  isLoading: boolean;
}

export interface AssetManagementActions {
  uploadAsset: (
    file: File,
    type: Asset['type'],
    category?: string,
    tags?: string[]
  ) => Promise<Asset | null>;
  deleteAsset: (asset: Asset) => Promise<boolean>;
  getAssetsByType: (type: Asset['type']) => Asset[];
  getAssetsByCategory: (category: string) => Asset[];
}
