
import { AttachmentData } from './types.ts';
import { arrayBufferToBase64 } from './storage.ts';

export async function processImageFile(supabase: any, filePath: string, fileName: string): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
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
    const base64 = arrayBufferToBase64(arrayBuffer);
    
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

export async function processTextFile(supabase: any, filePath: string, fileName: string): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
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
