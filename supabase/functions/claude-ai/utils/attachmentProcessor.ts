
import { AttachmentData } from './types.ts';
import { downloadImageFromStorage, downloadImageFromUrl } from './imageDownloader.ts';
import { fetchWebsiteContent } from './websiteFetcher.ts';

export async function processFileAttachment(
  supabase: any, 
  attachment: AttachmentData
): Promise<{ type: 'text' | 'image'; text?: string; source?: any }[]> {
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  
  if (!attachment.uploadPath) {
    console.log('Skipping file attachment (no upload path):', attachment.name);
    return contentItems;
  }

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
        console.log('Successfully added image to vision analysis:', attachment.name);
      } else {
        contentItems.push({
          type: 'text',
          text: `[Image attachment: ${attachment.name} - Failed to load for analysis. The image may be corrupted, too large, or in an unsupported format. Please try uploading a smaller JPEG or PNG file.]`
        });
        console.log('Failed to load image, added detailed error message:', attachment.name);
      }
    } catch (error) {
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

  return contentItems;
}

export async function processUrlAttachment(
  attachment: AttachmentData
): Promise<{ type: 'text' | 'image'; text?: string; source?: any }[]> {
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  
  if (!attachment.url) {
    console.log('Skipping URL attachment (no URL):', attachment.name);
    return contentItems;
  }

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
        console.log('Successfully added URL image to vision analysis:', attachment.url);
      } else {
        contentItems.push({
          type: 'text',
          text: `[Image URL: ${attachment.url} - Could not be loaded for analysis. The URL may be inaccessible, the image may be too large, or it may not be a valid image. Please check the URL and try again.]`
        });
        console.log('Failed to load URL image, added detailed error message:', attachment.url);
      }
    } catch (error) {
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

  return contentItems;
}
