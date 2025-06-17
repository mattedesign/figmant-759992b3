
// Main export point for asset management hooks
export { useAssetState } from './useAssetState';
export { useAssetStore } from './useAssetStore';
export { useAssetLoader } from './useAssetLoader';
export { useAssetOperations } from './assetOperations';

// Export utility modules for potential reuse
export { getAllFilesRecursively, getPublicUrl } from './assetFileOperations';
export { determineAssetType, determineAssetCategory, determineMimeType } from './assetTypeDetection';
export { createAssetFromFile } from './assetCreation';
export { createLogoAssets, checkIfLogoExists } from './logoAssetHandler';

// Export operation functions for direct use if needed
export { uploadAssetOperation, replaceAssetOperation, deleteAssetOperation } from './operations';
