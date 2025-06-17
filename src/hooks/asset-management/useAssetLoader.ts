
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { Asset } from '@/types/assets';
import { getAllFilesRecursively } from './assetFileOperations';
import { createAssetFromFile } from './assetCreation';
import { createLogoAssets, checkIfLogoExists } from './logoAssetHandler';

interface UseAssetLoaderProps {
  setAssets: (assets: Asset[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAssetLoader = ({ setAssets, setIsLoading }: UseAssetLoaderProps) => {
  const { user } = useAuth();
  const { logoConfig } = useLogoConfig();

  const loadExistingAssets = async () => {
    if (!user) return;

    try {
      console.log('Loading existing assets from storage...');
      setIsLoading(true);
      
      const loadedAssets: Asset[] = [];

      // Get all files recursively from storage
      const allFiles = await getAllFilesRecursively();
      console.log('All files found recursively:', allFiles);

      // Process each file and create asset objects
      for (const file of allFiles) {
        if (!file.name || !file.fullPath) continue;
        
        const asset = createAssetFromFile(file, user.id);
        loadedAssets.push(asset);
        console.log('Loaded asset:', asset);
      }

      // Handle logo configuration assets
      const logoAssets = createLogoAssets(logoConfig, user.id);
      
      // Add logo assets if they don't already exist
      for (const logoAsset of logoAssets) {
        if (!checkIfLogoExists(loadedAssets, logoAsset.url)) {
          loadedAssets.unshift(logoAsset);
        }
      }

      console.log('Total assets loaded:', loadedAssets.length);
      setAssets(loadedAssets);
    } catch (error) {
      console.error('Failed to load existing assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load existing assets on mount
  useEffect(() => {
    if (user) {
      loadExistingAssets();
    }
  }, [user, logoConfig]);

  return {
    loadExistingAssets
  };
};
