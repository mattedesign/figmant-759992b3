
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

    // Test actual upload capability with a tiny test file
    const testBlob = new Blob(['storage-test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'storage-test.txt', { type: 'text/plain' });
    
    const testPath = `${user.id}/storage-verification-${Date.now()}.txt`;
    
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

    // Create a small test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const testPath = `${user.id}/test-${Date.now()}.txt`;
    
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
