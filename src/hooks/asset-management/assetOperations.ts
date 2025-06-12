
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';
import { uploadAssetToStorage, deleteAssetFromStorage } from './assetStorage';

export const useAssetOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateActiveLogo } = useLogoConfig();

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
      const { publicUrl, uploadPath } = await uploadAssetToStorage(file, type, category, user.id);
      const randomId = Math.random().toString(36).substr(2, 9);

      // Create asset record
      const newAsset: Asset = {
        id: randomId,
        name: file.name,
        type,
        category,
        url: publicUrl,
        uploadPath,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        tags,
        isActive: true
      };

      // If this is a logo asset, update the logo configuration first
      if (type === 'logo') {
        console.log('Logo asset uploaded, updating logo configuration...');
        const updateSuccess = await updateActiveLogo(publicUrl);
        
        if (!updateSuccess) {
          // If logo config update failed, clean up the uploaded file
          await deleteAssetFromStorage(uploadPath);
          throw new Error('Failed to update logo configuration');
        }
      }

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
    }
  }, [toast, user, updateActiveLogo]);

  const deleteAsset = useCallback(async (asset: Asset): Promise<boolean> => {
    if (!user) return false;

    try {
      await deleteAssetFromStorage(asset.uploadPath);

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
    }
  }, [toast, user]);

  return {
    uploadAsset,
    deleteAsset
  };
};
