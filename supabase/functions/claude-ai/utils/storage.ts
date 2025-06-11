
export async function verifyStorageBucket(supabase: any): Promise<boolean> {
  try {
    console.log('=== VERIFYING STORAGE BUCKET ===');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return false;
    }
    
    const designUploadsBucket = buckets?.find(bucket => bucket.name === 'design-uploads');
    
    if (!designUploadsBucket) {
      console.error('design-uploads bucket not found');
      return false;
    }
    
    console.log('Storage bucket verified successfully:', designUploadsBucket);
    return true;
  } catch (error) {
    console.error('Storage bucket verification failed:', error);
    return false;
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
