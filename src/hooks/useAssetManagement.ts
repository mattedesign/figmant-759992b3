import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Asset, AssetUploadConfig, ASSET_CATEGORIES } from '@/types/assets';
import { useAuth } from '@/contexts/AuthContext';

interface LogoConfigRow {
  active_logo_url: string;
}

export const useAssetManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load existing assets on mount
  useEffect(() => {
    if (user) {
      loadExistingAssets();
    }
  }, [user]);

  const loadExistingAssets = async () => {
    if (!user) return;

    try {
      // For now, we'll simulate loading assets since we don't have a proper assets table
      // In a real implementation, this would load from a database table
      console.log('Loading existing assets...');
      
      // Check if we have any logo configurations in the database
      const { data: logoConfig } = await supabase
        .rpc('get_logo_config', { user_id: user.id }) as { data: LogoConfigRow | null };

      if (logoConfig?.active_logo_url && logoConfig.active_logo_url.includes('supabase')) {
        // Create a mock asset for the stored logo
        const mockAsset: Asset = {
          id: 'stored-logo',
          name: 'Stored Logo',
          type: 'logo',
          category: ASSET_CATEGORIES.BRANDING,
          url: logoConfig.active_logo_url,
          uploadPath: logoConfig.active_logo_url,
          fileSize: 0,
          mimeType: 'image/png',
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.id,
          tags: ['main-logo'],
          isActive: true
        };
        setAssets([mockAsset]);
      }
    } catch (error) {
      console.error('Failed to load existing assets:', error);
    }
  };

  const uploadAsset = useCallback(async (
    file: File,
    type: Asset['type'],
    category: string = ASSET_CATEGORIES.CONTENT,
    tags: string[] = []
  ): Promise<Asset | null> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "You must be logged in to upload assets.",
      });
      return null;
    }

    try {
      setIsLoading(true);

      // Create organized file path with sanitized file name
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = new Date().toISOString().split('T')[0];
      const randomId = Math.random().toString(36).substr(2, 9);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const organizedPath = `assets/${category}/${type}/${timestamp}/${randomId}_${sanitizedFileName}`;

      console.log('Uploading asset to organized path:', organizedPath);
      console.log('File type:', file.type, 'File size:', file.size);

      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('design-uploads')
        .upload(organizedPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(organizedPath);

      console.log('Generated public URL:', publicUrl);

      // Create asset record
      const newAsset: Asset = {
        id: randomId,
        name: file.name,
        type,
        category,
        url: publicUrl,
        uploadPath: organizedPath,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        tags,
        isActive: true
      };

      // Store in local state (in a real app, this would go to a database)
      setAssets(prev => [...prev, newAsset]);

      toast({
        title: "Asset Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      console.log('Asset created successfully:', newAsset);
      return newAsset;
    } catch (error) {
      console.error('Asset upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload asset',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const deleteAsset = useCallback(async (asset: Asset): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);

      console.log('Deleting asset from path:', asset.uploadPath);

      // Delete from storage
      const { error } = await supabase.storage
        .from('design-uploads')
        .remove([asset.uploadPath]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      // Remove from local state
      setAssets(prev => prev.filter(a => a.id !== asset.id));

      toast({
        title: "Asset Deleted",
        description: `${asset.name} has been deleted successfully.`,
      });

      console.log('Asset deleted successfully');
      return true;
    } catch (error) {
      console.error('Asset deletion failed:', error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete asset',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const getAssetsByType = useCallback((type: Asset['type']) => {
    return assets.filter(asset => asset.type === type && asset.isActive);
  }, [assets]);

  const getAssetsByCategory = useCallback((category: string) => {
    return assets.filter(asset => asset.category === category && asset.isActive);
  }, [assets]);

  return {
    assets,
    isLoading,
    uploadAsset,
    deleteAsset,
    getAssetsByType,
    getAssetsByCategory
  };
};
