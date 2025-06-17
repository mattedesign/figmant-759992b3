
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { supabase } from '@/integrations/supabase/client';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

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
      
      // Get all files from the design-uploads bucket recursively
      const { data: files, error } = await supabase.storage
        .from('design-uploads')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading assets from storage:', error);
        return;
      }

      console.log('Files found in storage:', files);

      const loadedAssets: Asset[] = [];

      // First, get all files recursively by exploring subdirectories
      const getAllFiles = async (prefix = '') => {
        const { data: items, error } = await supabase.storage
          .from('design-uploads')
          .list(prefix, {
            limit: 1000,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (error) {
          console.error('Error listing files in', prefix, ':', error);
          return [];
        }

        const allFiles = [];
        
        for (const item of items || []) {
          if (item.id === null) {
            // This is a directory, explore it recursively
            const subPath = prefix ? `${prefix}/${item.name}` : item.name;
            const subFiles = await getAllFiles(subPath);
            allFiles.push(...subFiles);
          } else {
            // This is a file
            const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
            allFiles.push({
              ...item,
              fullPath
            });
          }
        }
        
        return allFiles;
      };

      const allFiles = await getAllFiles();
      console.log('All files found recursively:', allFiles);

      // Process each file and create asset objects
      for (const file of allFiles) {
        if (!file.name || !file.fullPath) continue;
        
        // Get the public URL for the file
        const { data: urlData } = supabase.storage
          .from('design-uploads')
          .getPublicUrl(file.fullPath);

        // Determine asset type based on file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        let assetType: Asset['type'] = 'other';
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
          // Check if it's specifically a logo based on path or filename
          if (file.fullPath.includes('/logo/') || file.name.toLowerCase().includes('logo')) {
            assetType = 'logo';
          } else {
            assetType = 'image';
          }
        } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension || '')) {
          assetType = 'video';
        } else if (['pdf'].includes(extension || '')) {
          assetType = 'document';
        }

        // Determine category based on path structure - using proper ASSET_CATEGORIES constants
        let category: Asset['category'] = ASSET_CATEGORIES.CONTENT;
        if (file.fullPath.includes('branding/') || file.fullPath.includes('/logo/')) {
          category = ASSET_CATEGORIES.BRANDING;
        } else if (file.fullPath.includes('system/')) {
          category = ASSET_CATEGORIES.SYSTEM;
        }

        // Determine MIME type
        let mimeType = 'application/octet-stream';
        if (['jpg', 'jpeg'].includes(extension || '')) mimeType = 'image/jpeg';
        else if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'gif') mimeType = 'image/gif';
        else if (extension === 'webp') mimeType = 'image/webp';
        else if (extension === 'svg') mimeType = 'image/svg+xml';
        else if (extension === 'mp4') mimeType = 'video/mp4';
        else if (extension === 'webm') mimeType = 'video/webm';
        else if (extension === 'mov') mimeType = 'video/quicktime';
        else if (extension === 'avi') mimeType = 'video/x-msvideo';
        else if (extension === 'mkv') mimeType = 'video/x-matroska';
        else if (extension === 'pdf') mimeType = 'application/pdf';

        const asset: Asset = {
          id: `storage-${file.fullPath.replace(/[^a-zA-Z0-9]/g, '-')}`,
          name: file.name,
          type: assetType,
          category,
          url: urlData.publicUrl,
          uploadPath: file.fullPath,
          fileSize: file.metadata?.size || 0,
          mimeType,
          uploadedAt: file.created_at || new Date().toISOString(),
          uploadedBy: user.id,
          tags: [assetType, category],
          isActive: true
        };

        loadedAssets.push(asset);
        console.log('Loaded asset:', asset);
      }

      // If we have a logo configuration that's not the default, add it too if not already present
      if (logoConfig.activeLogoUrl && logoConfig.activeLogoUrl.includes('supabase')) {
        const existingLogo = loadedAssets.find(a => a.url === logoConfig.activeLogoUrl);
        if (!existingLogo) {
          const mockLogoAsset: Asset = {
            id: 'current-active-logo',
            name: 'Current Active Logo',
            type: 'logo',
            category: ASSET_CATEGORIES.BRANDING,
            url: logoConfig.activeLogoUrl,
            uploadPath: logoConfig.activeLogoUrl,
            fileSize: 0,
            mimeType: 'image/png',
            uploadedAt: new Date().toISOString(),
            uploadedBy: user.id,
            tags: ['active-logo', 'branding'],
            isActive: true
          };
          loadedAssets.unshift(mockLogoAsset);
        }
      }

      // Add collapsed logo if it exists and is different
      if (logoConfig.collapsedLogoUrl && logoConfig.collapsedLogoUrl.includes('supabase')) {
        const existingCollapsed = loadedAssets.find(a => a.url === logoConfig.collapsedLogoUrl);
        if (!existingCollapsed) {
          const mockCollapsedAsset: Asset = {
            id: 'current-collapsed-logo',
            name: 'Current Collapsed Logo',
            type: 'logo',
            category: ASSET_CATEGORIES.BRANDING,
            url: logoConfig.collapsedLogoUrl,
            uploadPath: logoConfig.collapsedLogoUrl,
            fileSize: 0,
            mimeType: 'image/svg+xml',
            uploadedAt: new Date().toISOString(),
            uploadedBy: user.id,
            tags: ['collapsed-logo', 'branding'],
            isActive: true
          };
          loadedAssets.unshift(mockCollapsedAsset);
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
