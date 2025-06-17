
import { supabase } from '@/integrations/supabase/client';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const uploadAssetOperation = async (
  file: File,
  type: Asset['type'],
  category: Asset['category'] = ASSET_CATEGORIES.CONTENT,
  tags: string[] = [],
  userId: string
): Promise<Asset | null> => {
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
      id: `${userId}-${Date.now()}-${randomId}`,
      name: file.name,
      type,
      category,
      url: urlData.publicUrl,
      uploadPath: filePath,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
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
