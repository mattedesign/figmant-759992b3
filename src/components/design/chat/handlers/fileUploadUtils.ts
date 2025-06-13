
import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (file: File): Promise<string> => {
  console.log('=== ENHANCED FILE UPLOAD UTILS START ===');
  
  try {
    // Step 1: Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Authentication error during upload:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!user) {
      console.error('User not authenticated for file upload');
      throw new Error('User not authenticated - please sign in again');
    }

    console.log('✓ User authenticated for upload:', user.id);

    // Step 2: Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error('File size exceeds 50MB limit');
    }

    console.log('✓ File validation passed:', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });

    // Step 3: Generate upload path
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.id}/chat-${timestamp}-${randomId}.${fileExt}`;

    console.log('Upload path generated:', filePath);

    // Step 4: Attempt upload with detailed error handling
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error details:', {
        error: uploadError,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        userId: user.id
      });

      // Provide more specific error messages
      if (uploadError.message.includes('not found')) {
        throw new Error('Storage bucket not accessible. Please contact your administrator.');
      } else if (uploadError.message.includes('policy')) {
        throw new Error('Upload permission denied. Please check your account settings.');
      } else if (uploadError.message.includes('size')) {
        throw new Error('File size exceeds storage limits.');
      } else {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }

    if (!uploadData) {
      throw new Error('Upload completed but no data returned');
    }

    console.log('✓ File uploaded successfully:', {
      path: uploadData.path,
      fullPath: uploadData.fullPath,
      id: uploadData.id
    });

    console.log('=== ENHANCED FILE UPLOAD UTILS SUCCESS ===');
    return filePath;

  } catch (error) {
    console.error('=== FILE UPLOAD UTILS ERROR ===');
    console.error('Upload failed with error:', error);
    
    // Re-throw with enhanced error message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unexpected error during file upload');
    }
  }
};
