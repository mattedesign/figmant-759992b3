
import { supabase } from '@/integrations/supabase/client';

const UPLOAD_TIMEOUT_MS = 30000; // 30 seconds

export const uploadFileToStorage = async (file: File): Promise<string> => {
  console.log('=== FILE UPLOAD START ===');
  
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.error('Upload timeout reached');
      reject(new Error('Upload timeout - please try again'));
    }, UPLOAD_TIMEOUT_MS);

    try {
      // Step 1: Verify authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        clearTimeout(timeoutId);
        console.error('Authentication error during upload:', authError);
        reject(new Error(`Authentication failed: ${authError.message}`));
        return;
      }

      if (!user) {
        clearTimeout(timeoutId);
        console.error('User not authenticated for file upload');
        reject(new Error('Please sign in to upload files'));
        return;
      }

      console.log('✓ User authenticated for upload:', user.id);

      // Step 2: Validate file
      if (!file || file.size === 0) {
        clearTimeout(timeoutId);
        reject(new Error('Invalid file provided'));
        return;
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        clearTimeout(timeoutId);
        reject(new Error('File size exceeds 50MB limit'));
        return;
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
      const filePath = `${user.id}/chat-${timestamp}-${randomId}.${fileExt}`;

      console.log('Upload path generated:', filePath);

      // Step 4: Attempt upload with detailed error handling
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearTimeout(timeoutId);

      if (uploadError) {
        console.error('Storage upload error details:', {
          error: uploadError,
          filePath,
          fileSize: file.size,
          fileType: file.type,
          userId: user.id
        });

        // Provide specific error messages based on error type
        if (uploadError.message?.toLowerCase().includes('not found')) {
          reject(new Error('Storage not accessible. Please contact support.'));
        } else if (uploadError.message?.toLowerCase().includes('policy')) {
          reject(new Error('Upload permission denied. Please check your account.'));
        } else if (uploadError.message?.toLowerCase().includes('size')) {
          reject(new Error('File size exceeds storage limits.'));
        } else if (uploadError.message?.toLowerCase().includes('duplicate')) {
          // Retry with different filename
          const retryPath = `${user.id}/chat-${timestamp}-${randomId}-retry.${fileExt}`;
          console.log('Retrying upload with new path:', retryPath);
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('design-uploads')
            .upload(retryPath, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (retryError) {
            reject(new Error(`Upload failed after retry: ${retryError.message}`));
            return;
          }
          
          console.log('✓ File uploaded successfully on retry:', retryData.path);
          resolve(retryPath);
          return;
        } else {
          reject(new Error(`Upload failed: ${uploadError.message}`));
        }
        return;
      }

      if (!uploadData) {
        reject(new Error('Upload completed but no data returned'));
        return;
      }

      console.log('✓ File uploaded successfully:', {
        path: uploadData.path,
        fullPath: uploadData.fullPath,
        id: uploadData.id
      });

      console.log('=== FILE UPLOAD SUCCESS ===');
      resolve(filePath);

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('=== FILE UPLOAD ERROR ===');
      console.error('Upload failed with error:', error);
      
      // Re-throw with enhanced error message
      if (error instanceof Error) {
        reject(error);
      } else {
        reject(new Error('Unexpected error during file upload'));
      }
    }
  });
};
