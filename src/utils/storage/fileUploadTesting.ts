
import { supabase } from '@/integrations/supabase/client';

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
