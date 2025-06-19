
export function isImageFile(attachment: { name?: string; type?: string }): boolean {
  return attachment.type?.startsWith('image/') || 
         /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(attachment.name || '');
}

export function getFilePathFromAttachment(attachment: { uploadPath?: string; path?: string; url?: string }): string | null {
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

  return filePath;
}
