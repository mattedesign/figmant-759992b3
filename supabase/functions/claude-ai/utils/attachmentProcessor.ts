
import { AttachmentData } from './types.ts';

export async function processFileAttachment(supabase: any, attachment: AttachmentData): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING FILE ATTACHMENT ===');
  console.log('File attachment details:', {
    name: attachment.name,
    type: attachment.type,
    hasUploadPath: !!attachment.uploadPath,
    hasPath: !!attachment.path,
    hasUrl: !!attachment.url
  });

  // Determine the file path to use
  let filePath = attachment.uploadPath || attachment.path;
  
  if (!filePath && attachment.url) {
    // Extract path from blob URL if available
    try {
      const urlObj = new URL(attachment.url);
      if (urlObj.pathname) {
        filePath = urlObj.pathname.replace(/^\//, ''); // Remove leading slash
        console.log('Extracted path from URL:', filePath);
      }
    } catch (error) {
      console.log('Failed to extract path from URL:', error);
    }
  }

  if (!filePath) {
    console.log('Skipping file attachment (no upload path):', attachment.name);
    return [{
      type: 'text',
      text: `[File: ${attachment.name} - Upload path not available for analysis]`
    }];
  }

  // Check if this is an image file
  const isImage = attachment.type?.startsWith('image/') || 
                  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(attachment.name || '');

  if (isImage) {
    console.log('Processing as image:', attachment.name);
    return await processImageFile(supabase, filePath, attachment.name);
  } else {
    console.log('Processing as text file:', attachment.name);
    return await processTextFile(supabase, filePath, attachment.name);
  }
}

async function processImageFile(supabase: any, filePath: string, fileName: string): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  try {
    console.log('Downloading image from storage:', filePath);
    
    const { data: imageData, error: downloadError } = await supabase.storage
      .from('design-uploads')
      .download(filePath);

    if (downloadError) {
      console.error('Failed to download image:', downloadError);
      return [{
        type: 'text',
        text: `[Image: ${fileName} - Failed to load: ${downloadError.message}]`
      }];
    }

    if (!imageData) {
      console.error('No image data received');
      return [{
        type: 'text',
        text: `[Image: ${fileName} - No image data received]`
      }];
    }

    // Convert image to base64
    const arrayBuffer = await imageData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Determine media type
    const mediaType = getMediaTypeFromFileName(fileName);
    
    console.log('Image processed successfully:', {
      fileName,
      mediaType,
      sizeBytes: arrayBuffer.byteLength,
      base64Length: base64.length
    });

    return [{
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: base64
      }
    }];

  } catch (error) {
    console.error('Error processing image file:', error);
    return [{
      type: 'text',
      text: `[Image: ${fileName} - Processing error: ${error.message}]`
    }];
  }
}

async function processTextFile(supabase: any, filePath: string, fileName: string): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  try {
    console.log('Downloading text file from storage:', filePath);
    
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('design-uploads')
      .download(filePath);

    if (downloadError) {
      console.error('Failed to download file:', downloadError);
      return [{
        type: 'text',
        text: `[File: ${fileName} - Failed to load: ${downloadError.message}]`
      }];
    }

    if (!fileData) {
      console.error('No file data received');
      return [{
        type: 'text',
        text: `[File: ${fileName} - No file data received]`
      }];
    }

    const textContent = await fileData.text();
    console.log('Text file processed successfully:', {
      fileName,
      contentLength: textContent.length
    });

    return [{
      type: 'text',
      text: `[File: ${fileName}]\n${textContent}`
    }];

  } catch (error) {
    console.error('Error processing text file:', error);
    return [{
      type: 'text',
      text: `[File: ${fileName} - Processing error: ${error.message}]`
    }];
  }
}

export async function processUrlAttachment(attachment: AttachmentData): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING URL ATTACHMENT ===');
  console.log('URL attachment details:', {
    name: attachment.name,
    url: attachment.url
  });

  if (!attachment.url) {
    return [{
      type: 'text',
      text: `[URL: ${attachment.name} - No URL provided]`
    }];
  }

  try {
    console.log('Fetching website content:', attachment.url);
    
    const response = await fetch(attachment.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FigmantBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    console.log('Website response:', {
      status: response.status,
      contentType,
      url: attachment.url
    });

    // Check if it's an image
    if (contentType.startsWith('image/')) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      return [{
        type: 'image',
        source: {
          type: 'base64',
          media_type: contentType,
          data: base64
        }
      }];
    } else {
      // Assume it's a webpage
      const html = await response.text();
      const cleanText = extractTextFromHTML(html);
      
      return [{
        type: 'text',
        text: `[Website: ${attachment.url}]\n${cleanText.slice(0, 8000)}${cleanText.length > 8000 ? '...' : ''}`
      }];
    }

  } catch (error) {
    console.error('Error fetching URL:', error);
    return [{
      type: 'text',
      text: `[URL: ${attachment.url} - Failed to fetch: ${error.message}]`
    }];
  }
}

function getMediaTypeFromFileName(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  const mediaTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml'
  };
  
  return mediaTypes[extension || ''] || 'image/jpeg';
}

function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  cleanHtml = cleanHtml.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  cleanHtml = cleanHtml.replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'")
                     .replace(/&nbsp;/g, ' ');
  
  // Clean up whitespace
  cleanHtml = cleanHtml.replace(/\s+/g, ' ').trim();
  
  return cleanHtml;
}
