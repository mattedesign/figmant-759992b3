
import { AttachmentData } from './types.ts';
import { processFileAttachment, processUrlAttachment } from './attachmentProcessor.ts';

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
      hasUrl: !!attachment.url,
      isImageMimeType: attachment.type?.startsWith('image/')
    });

    let processedItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];

    // Handle different attachment types
    if (attachment.type === 'file' || attachment.type?.startsWith('image/')) {
      // Handle both explicit 'file' type and image MIME types
      processedItems = await processFileAttachment(supabase, attachment);
    } else if (attachment.type === 'url') {
      processedItems = await processUrlAttachment(attachment);
    } else {
      console.log('Skipping attachment (unknown type):', {
        type: attachment.type,
        name: attachment.name
      });
      continue;
    }

    // Count results for statistics
    for (const item of processedItems) {
      if (item.type === 'image') {
        successfulImages++;
      } else if (item.text && item.text.includes('Failed to load') || item.text && item.text.includes('Processing error')) {
        failedImages++;
      } else if (item.text && item.text.includes('[Website:')) {
        websitesFetched++;
      }
    }

    contentItems.push(...processedItems);
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
