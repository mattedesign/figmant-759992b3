
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export class FileUploadService {
  static async uploadFile(file: File, attachmentId: string): Promise<string> {
    try {
      console.log('📤 FILE UPLOAD SERVICE - Starting upload for:', file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${attachmentId}.${fileExt}`;
      const filePath = `analysis-attachments/${fileName}`;

      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (error) {
        console.error('📤 FILE UPLOAD SERVICE - Upload failed:', error);
        throw error;
      }

      console.log('📤 FILE UPLOAD SERVICE - Upload successful:', data.path);
      return data.path;
    } catch (error) {
      console.error('📤 FILE UPLOAD SERVICE - Error:', error);
      throw error;
    }
  }

  static async getPublicUrl(path: string): Promise<string> {
    const { data } = supabase.storage
      .from('design-uploads')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
