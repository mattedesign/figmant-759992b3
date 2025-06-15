
import { verifyStorageBucket, arrayBufferToBase64 } from './storage.ts';

export async function downloadImageFromStorage(supabase: any, filePath: string): Promise<{ base64: string; mimeType: string } | null> {
  const maxRetries = 2;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`=== DOWNLOADING IMAGE FROM STORAGE (Attempt ${attempt + 1}/${maxRetries}) ===`);
      console.log('File path:', filePath);
      
      // Verify bucket exists first
      const bucketExists = await verifyStorageBucket(supabase);
      if (!bucketExists) {
        console.error('Storage bucket verification failed');
        throw new Error('Storage bucket not accessible');
      }
      
      // Create a signed URL with appropriate timeout
      const { data: urlData, error: urlError } = await supabase.storage
        .from('design-uploads')
        .createSignedUrl(filePath, 300); // 5 minutes

      if (urlError || !urlData?.signedUrl) {
        console.error('Failed to create signed URL:', urlError);
        throw new Error(`Signed URL creation failed: ${urlError?.message || 'Unknown error'}`);
      }

      console.log('Signed URL created successfully');
      
      // Download with enhanced error handling and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Download timeout after 20 seconds');
      }, 20000);
      
      try {
        const response = await fetch(urlData.signedUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Supabase-Edge-Function'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log('Download response:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        });
        
        if (!response.ok) {
          console.error(`Download failed with status ${response.status}: ${response.statusText}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'image/png';
        
        // Enhanced content type validation
        if (!contentType.startsWith('image/')) {
          console.error('Downloaded file is not an image:', contentType);
          throw new Error(`Invalid content type: ${contentType}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Enhanced size validation
        const maxSize = 20 * 1024 * 1024; // 20MB limit
        if (arrayBuffer.byteLength > maxSize) {
          console.error('File too large:', arrayBuffer.byteLength);
          throw new Error(`File size ${Math.round(arrayBuffer.byteLength / 1024 / 1024)}MB exceeds 20MB limit`);
        }
        
        if (arrayBuffer.byteLength === 0) {
          console.error('Downloaded file is empty');
          throw new Error('Downloaded file is empty');
        }
        
        // Convert to base64 using proper method
        const base64 = arrayBufferToBase64(arrayBuffer);
        
        console.log('Image downloaded and converted successfully:', {
          sizeBytes: arrayBuffer.byteLength,
          mimeType: contentType,
          base64Length: base64.length
        });
        
        console.log('=== DOWNLOAD COMPLETE ===');
        return { base64, mimeType: contentType };
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('Download timed out');
          throw new Error('Download timeout - file may be too large or connection is slow');
        } else {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }
      }
      
    } catch (error) {
      console.error(`Download attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt >= maxRetries) {
        console.error('All download attempts failed');
        return null;
      }
      
      // Exponential backoff with jitter
      const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 5000);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  return null;
}

export async function downloadImageFromUrl(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('=== DOWNLOADING IMAGE FROM URL ===');
    console.log('URL:', url);
    
    // Enhanced URL validation
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      console.error('Invalid URL format');
      return null;
    }
    
    // Basic security check
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.error('Unsupported protocol:', urlObj.protocol);
      return null;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('URL download timeout after 15 seconds');
    }, 15000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Supabase-Edge-Function',
        'Accept': 'image/*'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('URL download response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });
    
    if (!response.ok) {
      console.error('Failed to download from URL:', response.status, response.statusText);
      return null;
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    
    if (!contentType.startsWith('image/')) {
      console.error('URL does not point to an image:', contentType);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength > 20 * 1024 * 1024) {
      console.error('Image too large from URL:', arrayBuffer.byteLength);
      return null;
    }
    
    const base64 = arrayBufferToBase64(arrayBuffer);
    
    console.log('URL image downloaded successfully:', {
      sizeBytes: arrayBuffer.byteLength,
      mimeType: contentType,
      base64Length: base64.length
    });
    
    console.log('=== URL DOWNLOAD COMPLETE ===');
    return { base64, mimeType: contentType };
  } catch (error) {
    console.error('Error downloading image from URL:', error);
    
    if (error.name === 'AbortError') {
      console.error('URL download timed out');
    }
    
    return null;
  }
}
