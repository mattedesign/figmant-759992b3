
import { supabase } from '@/integrations/supabase/client';

export const verifyStorageAccess = async () => {
  try {
    console.log('Verifying storage access with actual upload test...');
    
    // First check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error during storage verification:', authError);
      return { success: false, error: 'User authentication failed' };
    }

    if (!user) {
      console.error('No authenticated user found');
      return { success: false, error: 'User not authenticated' };
    }

    console.log('User authenticated, testing upload capability...');

    // Create a minimal PNG blob (1x1 transparent PNG)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const testBlob = new Blob([pngData], { type: 'image/png' });
    const testFile = new File([testBlob], 'storage-test.png', { type: 'image/png' });
    
    const testPath = `${user.id}/storage-verification-${Date.now()}.png`;
    
    console.log('Testing upload to path:', testPath);
    
    // Try to upload the test file
    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('Test upload failed:', uploadError);
      return { 
        success: false, 
        error: `Storage upload test failed: ${uploadError.message}` 
      };
    }

    console.log('Test upload successful, cleaning up...');

    // Clean up the test file
    const { error: deleteError } = await supabase.storage
      .from('design-uploads')
      .remove([testPath]);

    if (deleteError) {
      console.warn('Test file cleanup failed:', deleteError);
      // Don't fail verification if cleanup fails
    }

    console.log('Storage verification completed successfully');
    return { success: true };

  } catch (error) {
    console.error('Unexpected error during storage verification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unexpected error during storage verification' 
    };
  }
};

export const testFileUpload = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create a minimal PNG blob instead of text file
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const testBlob = new Blob([pngData], { type: 'image/png' });
    const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
    
    const testPath = `${user.id}/test-${Date.now()}.png`;
    
    console.log('Testing file upload to:', testPath);
    
    // Try to upload the test file
    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('Test upload failed:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Clean up the test file
    await supabase.storage
      .from('design-uploads')
      .remove([testPath]);

    console.log('Test upload successful');
    return { success: true };

  } catch (error) {
    console.error('Test upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
