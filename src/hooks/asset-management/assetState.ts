
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { supabase } from '@/integrations/supabase/client';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const useAssetState = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { logoConfig } = useLogoConfig();

  // Load existing assets on mount
  useEffect(() => {
    if (user) {
      loadExistingAssets();
    }
  }, [user, logoConfig]);

  const loadExistingAssets = async () => {
    if (!user) return;

    try {
      console.log('Loading existing assets from storage...');
      setIsLoading(true);
      
      // Get all files from the design-uploads bucket
      const { data: files, error } = await supabase.storage
        .from('design-uploads')
        .list('assets', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading assets from storage:', error);
        return;
      }

      console.log('Files found in storage:', files);

      const loadedAssets: Asset[] = [];

      // Process each file and create asset objects
      for (const file of files || []) {
        if (file.name && !file.name.includes('/')) continue; // Skip directories
        
        // Extract path components to determine type and category
        const pathParts = file.name.split('/');
        if (pathParts.length < 3) continue; // Skip malformed paths
        
        const [category, type, datePath, filename] = pathParts;
        
        // Get the public URL for the file
        const { data: urlData } = supabase.storage
          .from('design-uploads')
          .getPublicUrl(`assets/${file.name}`);

        // Determine asset type based on file extension and path
        let assetType: Asset['type'] = 'other';
        const extension = filename?.split('.').pop()?.toLowerCase();
        
        if (type === 'logo') {
          assetType = 'logo';
        } else if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
          assetType = 'image';
        } else if (type === 'video' || ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension || '')) {
          assetType = 'video';
        } else if (['pdf'].includes(extension || '')) {
          assetType = 'document';
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
          id: `storage-${file.name.replace(/[^a-zA-Z0-9]/g, '-')}`,
          name: filename || file.name,
          type: assetType,
          category: category || ASSET_CATEGORIES.CONTENT,
          url: urlData.publicUrl,
          uploadPath: `assets/${file.name}`,
          fileSize: file.metadata?.size || 0,
          mimeType,
          uploadedAt: file.created_at || new Date().toISOString(),
          uploadedBy: user.id,
          tags: [type || 'general'],
          isActive: true
        };

        loadedAssets.push(asset);
        console.log('Loaded asset:', asset);
      }

      // If we have a logo configuration that's not the default, add it too
      if (logoConfig.activeLogoUrl && logoConfig.activeLogoUrl.includes('supabase')) {
        const existingLogo = loadedAssets.find(a => a.url === logoConfig.activeLogoUrl);
        if (!existingLogo) {
          const mockLogoAsset: Asset = {
            id: 'current-logo',
            name: 'Current Active Logo',
            type: 'logo',
            category: ASSET_CATEGORIES.BRANDING,
            url: logoConfig.activeLogoUrl,
            uploadPath: logoConfig.activeLogoUrl,
            fileSize: 0,
            mimeType: 'image/png',
            uploadedAt: new Date().toISOString(),
            uploadedBy: user.id,
            tags: ['main-logo'],
            isActive: true
          };
          loadedAssets.unshift(mockLogoAsset);
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

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => {
      // Remove any existing logo assets if this is a new logo
      if (asset.type === 'logo') {
        return [asset, ...prev.filter(a => a.type !== 'logo')];
      }
      return [asset, ...prev];
    });
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
  }, []);

  const getAssetsByType = useCallback((type: Asset['type']) => {
    return assets.filter(asset => asset.type === type && asset.isActive);
  }, [assets]);

  const getAssetsByCategory = useCallback((category: string) => {
    return assets.filter(asset => asset.category === category && asset.isActive);
  }, [assets]);

  return {
    assets,
    isLoading,
    setIsLoading,
    addAsset,
    removeAsset,
    getAssetsByType,
    getAssetsByCategory,
    loadExistingAssets
  };
};
