
import { AttachmentData } from './types.ts';
import { verifyStorageBucket, arrayBufferToBase64 } from './storage.ts';
import { fetchWebsiteContent } from './websiteFetcher.ts';

async function downloadImageFromStorage(supabase: any, filePath: string): Promise<{ base64: string; mimeType: string } | null> {
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

async function downloadImageFromUrl(url: string): Promise<{ base64: string; mimeType: string } | null> {
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

export async function processAttachmentsForVision(supabase: any, attachments: AttachmentData[]): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING ATTACHMENTS FOR VISION ===');
  console.log('Processing', attachments.length, 'attachments');
  
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  let successfulImages = 0;
  let failedImages = 0;
  let websitesFetched = 0;
  
  for (let i = 0; i < attachments.length; i++) {
    const attachment = attachments[i];
    console.log(`Processing attachment ${i + 1}/${attachments.length}:`, {
      type: attachment.type,
      name: attachment.name,
      hasUploadPath: !!attachment.uploadPath,
      hasUrl: !!attachment.url
    });

    if (attachment.type === 'file' && attachment.uploadPath) {
      console.log('Processing file attachment with upload path:', attachment.uploadPath);
      
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);
      console.log('Is image file:', isImage);
      
      if (isImage) {
        try {
          const imageData = await downloadImageFromStorage(supabase, attachment.uploadPath);
          
          if (imageData) {
            contentItems.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageData.mimeType,
                data: imageData.base64
              }
            });
            successfulImages++;
            console.log('Successfully added image to vision analysis:', attachment.name);
          } else {
            failedImages++;
            contentItems.push({
              type: 'text',
              text: `[Image attachment: ${attachment.name} - Failed to load for analysis. The image may be corrupted, too large, or in an unsupported format. Please try uploading a smaller JPEG or PNG file.]`
            });
            console.log('Failed to load image, added detailed error message:', attachment.name);
          }
        } catch (error) {
          failedImages++;
          console.error('Image processing error:', error);
          contentItems.push({
            type: 'text',
            text: `[Image attachment: ${attachment.name} - Processing error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try re-uploading the image.]`
          });
        }
      } else {
        contentItems.push({
          type: 'text',
          text: `[File attachment: ${attachment.name} - Non-image files cannot be analyzed visually. For document analysis, please describe the content or provide screenshots.]`
        });
        console.log('Added non-image file as text reference:', attachment.name);
      }
    } else if (attachment.type === 'url' && attachment.url) {
      console.log('Processing URL attachment:', attachment.url);
      
      const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url) || 
                        attachment.url.includes('image') ||
                        attachment.url.includes('img');
      
      console.log('Is image URL:', isImageUrl);
      
      if (isImageUrl) {
        try {
          const imageData = await downloadImageFromUrl(attachment.url);
          
          if (imageData) {
            contentItems.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageData.mimeType,
                data: imageData.base64
              }
            });
            successfulImages++;
            console.log('Successfully added URL image to vision analysis:', attachment.url);
          } else {
            failedImages++;
            contentItems.push({
              type: 'text',
              text: `[Image URL: ${attachment.url} - Could not be loaded for analysis. The URL may be inaccessible, the image may be too large, or it may not be a valid image. Please check the URL and try again.]`
            });
            console.log('Failed to load URL image, added detailed error message:', attachment.url);
          }
        } catch (error) {
          failedImages++;
          console.error('URL image processing error:', error);
          contentItems.push({
            type: 'text',
            text: `[Image URL: ${attachment.url} - Processing error: ${error instanceof Error ? error.message : 'Unknown error'}]`
          });
        }
      } else {
        // This is a website URL - fetch content
        console.log('Fetching website content for:', attachment.url);
        try {
          const websiteContent = await fetchWebsiteContent(attachment.url);
          
          if (websiteContent) {
            websitesFetched++;
            contentItems.push({
              type: 'text',
              text: `[Website: ${attachment.url}]\n\nPage Content:\n${websiteContent}`
            });
            console.log('Successfully fetched website content:', {
              url: attachment.url,
              contentLength: websiteContent.length
            });
          }
        } catch (error) {
          console.error('Website content fetch error:', error);
          contentItems.push({
            type: 'text',
            text: `[Website URL: ${attachment.url} - Could not fetch content due to an error. Please provide screenshots of the specific pages you'd like me to analyze.]`
          });
        }
      }
    } else {
      console.log('Skipping attachment (no valid path or URL):', {
        type: attachment.type,
        name: attachment.name,
        hasUploadPath: !!attachment.uploadPath,
        hasUrl: !!attachment.url
      });
    }
  }
  
  console.log('Vision processing complete:', {
    totalContentItems: contentItems.length,
    imageItems: contentItems.filter(item => item.type === 'image').length,
    textItems: contentItems.filter(item => item.type === 'text').length,
    successfulImages,
    failedImages,
    websitesFetched
  });
  
  console.log('=== VISION PROCESSING END ===');
  return contentItems;
}
