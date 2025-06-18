
import { supabase } from '@/integrations/supabase/client';

export class FileUploadService {
  static async uploadFile(file: File): Promise<string> {
    console.log('🔍 PREMIUM ANALYSIS - Uploading file:', file.name);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated for file upload');
    }

    // Sanitize filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
    
    const fileName = `premium-analysis/${user.id}/${Date.now()}-${sanitizedName}`;
    
    console.log('🔍 PREMIUM ANALYSIS - Uploading to path:', fileName);
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('design-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('🔍 PREMIUM ANALYSIS - Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    console.log('🔍 PREMIUM ANALYSIS - File uploaded successfully:', data.path);
    return data.path;
  }

  static async uploadMultipleFiles(files: File[]): Promise<{ name: string; path: string; type: string; size: number }[]> {
    const uploadPromises = files.map(async (file) => {
      const path = await this.uploadFile(file);
      return {
        name: file.name,
        path,
        type: file.type,
        size: file.size
      };
    });

    return Promise.all(uploadPromises);
  }
}
