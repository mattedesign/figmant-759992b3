
import { Asset } from '@/types/assets';
import { determineAssetType, determineAssetCategory, determineMimeType } from './assetTypeDetection';
import { getPublicUrl } from './assetFileOperations';

interface FileItem {
  name: string;
  fullPath: string;
  created_at?: string;
  metadata?: any;
}

export const createAssetFromFile = (file: FileItem, userId: string): Asset => {
  const assetType = determineAssetType(file.name, file.fullPath);
  const category = determineAssetCategory(file.fullPath);
  const mimeType = determineMimeType(file.name);
  const url = getPublicUrl(file.fullPath);

  return {
    id: `storage-${file.fullPath.replace(/[^a-zA-Z0-9]/g, '-')}`,
    name: file.name,
    type: assetType,
    category,
    url,
    uploadPath: file.fullPath,
    fileSize: file.metadata?.size || 0,
    mimeType,
    uploadedAt: file.created_at || new Date().toISOString(),
    uploadedBy: userId,
    tags: [assetType, category],
    isActive: true
  };
};
