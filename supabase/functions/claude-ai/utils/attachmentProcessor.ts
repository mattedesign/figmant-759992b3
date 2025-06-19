
import { AttachmentData } from './types.ts';
import { processImageFile, processTextFile } from './fileProcessor.ts';
import { processUrlAttachment } from './urlProcessor.ts';
import { isImageFile, getFilePathFromAttachment } from './fileTypeDetector.ts';

export async function processFileAttachment(supabase: any, attachment: AttachmentData): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING FILE ATTACHMENT ===');
  console.log('File attachment details:', {
    name: attachment.name,
    type: attachment.type,
    hasUploadPath: !!attachment.uploadPath,
    hasPath: !!attachment.path,
    hasUrl: !!attachment.url
  });

  const filePath = getFilePathFromAttachment(attachment);

  if (!filePath) {
    console.log('Skipping file attachment (no upload path):', attachment.name);
    return [{
      type: 'text',
      text: `[File: ${attachment.name} - Upload path not available for analysis]`
    }];
  }

  // Check if this is an image file
  if (isImageFile(attachment)) {
    console.log('Processing as image:', attachment.name);
    return await processImageFile(supabase, filePath, attachment.name);
  } else {
    console.log('Processing as text file:', attachment.name);
    return await processTextFile(supabase, filePath, attachment.name);
  }
}

export { processUrlAttachment };
