
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';
import { AssetUploadSection } from './asset-manager/AssetUploadSection';
import { AssetGrid } from './asset-manager/AssetGrid';

export const AssetManager: React.FC = () => {
  const { assets, isLoading, uploadAsset, deleteAsset, getAssetsByType } = useAssetManagement();
  const [selectedType, setSelectedType] = useState<Asset['type']>('logo');
  const [selectedCategory, setSelectedCategory] = useState<Asset['category']>(ASSET_CATEGORIES.BRANDING);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.mkv'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB for videos
    onDrop: async (acceptedFiles) => {
      console.log('Files dropped in AssetManager:', acceptedFiles);
      for (const file of acceptedFiles) {
        console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Special handling for different file types
        if (file.type.startsWith('video/')) {
          console.log('Video file detected, uploading...');
        } else if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
          console.log('SVG file detected, uploading...');
        }
        
        await uploadAsset(file, selectedType, selectedCategory);
      }
    }
  });

  const currentAssets = getAssetsByType(selectedType);

  return (
    <div className="space-y-6">
      <AssetUploadSection
        selectedType={selectedType}
        selectedCategory={selectedCategory}
        onTypeChange={setSelectedType}
        onCategoryChange={setSelectedCategory}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isLoading={isLoading}
        fileRejections={fileRejections}
      />

      <AssetGrid
        assets={currentAssets}
        selectedType={selectedType}
        onDeleteAsset={deleteAsset}
        isLoading={isLoading}
      />
    </div>
  );
};
