
import { supabase } from '@/integrations/supabase/client';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';
import { useAuth } from '@/contexts/AuthContext';

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

    try {
      console.log('Starting asset upload:', { 
        fileName: file.name, 
        fileType: file.type, 
        fileSize: file.size,
        assetType: type,
        category 
      });

      // Create organized path: assets/{category}/{type}/{date}/{filename}
      const today = new Date().toISOString().split('T')[0];
      const randomId = Math.random().toString(36).substring(2, 11);
      const fileExtension = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${randomId}_${sanitizedName}`;
      const filePath = `assets/${category}/${type}/${today}/${fileName}`;

      console.log('Upload path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', urlData.publicUrl);

      // Create the Asset object
      const asset: Asset = {
        id: `${user.id}-${Date.now()}-${randomId}`,
        name: file.name,
        type,
        category,
        url: urlData.publicUrl,
        uploadPath: filePath,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        tags: [...tags, type],
        isActive: true
      };

      console.log('Asset object created:', asset);
      return asset;
    } catch (error) {
      console.error('Error uploading asset:', error);
      return null;
    }
  };

  const deleteAsset = async (asset: Asset): Promise<boolean> => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    try {
      console.log('Deleting asset:', asset.name, 'Path:', asset.uploadPath);

      // Extract the file path from the upload path or URL
      let filePath = asset.uploadPath;
      
      // If uploadPath doesn't start with 'assets/', try to extract from URL
      if (!filePath.startsWith('assets/')) {
        const urlParts = asset.url.split('/');
        const assetsIndex = urlParts.findIndex(part => part === 'assets');
        if (assetsIndex !== -1) {
          filePath = urlParts.slice(assetsIndex).join('/');
        }
      }

      console.log('Attempting to delete file at path:', filePath);

      const { error } = await supabase.storage
        .from('design-uploads')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting asset from storage:', error);
        // Don't throw here - the file might already be deleted
        // Just log the error and continue
      }

      console.log('Asset deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return false;
    }
  };

  return {
    uploadAsset,
    deleteAsset
  };
};
