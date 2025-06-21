
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

export interface AnalysisAttachment {
  id: string;
  file_name?: string;
  file_type?: string;
  file_path?: string;
  file_size?: number;
  url?: string;
  link_title?: string;
  link_description?: string;
  link_thumbnail?: string;
  type: 'file' | 'image' | 'link';
  created_at?: string;
}

export interface AnalysisScreenshot {
  id: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  url?: string;
  created_at?: string;
}

export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
  try {
    // Extract from analysis_results if it contains attachment data
    if (analysis.analysis_results) {
      const results = analysis.analysis_results;
      
      // Check for attachments_processed array
      if (results.attachments_processed && Array.isArray(results.attachments_processed)) {
        results.attachments_processed.forEach((attachment: any, index: number) => {
          if (typeof attachment === 'string') {
            // If it's just a filename/path
            attachments.push({
              id: `${analysis.id}-attachment-${index}`,
              file_name: attachment,
              file_path: attachment,
              type: attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'file',
              created_at: analysis.created_at
            });
          } else if (attachment && typeof attachment === 'object') {
            // If it's an object with attachment details
            attachments.push({
              id: attachment.id || `${analysis.id}-attachment-${index}`,
              file_name: attachment.file_name || attachment.name,
              file_type: attachment.file_type || attachment.type,
              file_path: attachment.file_path || attachment.url,
              file_size: attachment.file_size || attachment.size,
              type: attachment.type === 'link' ? 'link' : 
                    (attachment.file_type?.includes('image') || 
                     attachment.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? 'image' : 'file',
              created_at: attachment.created_at || analysis.created_at
            });
          }
        });
      }
      
      // Check for files_analyzed array
      if (results.files_analyzed && Array.isArray(results.files_analyzed)) {
        results.files_analyzed.forEach((file: any, index: number) => {
          attachments.push({
            id: file.id || `${analysis.id}-file-${index}`,
            file_name: file.filename || file.name || `File ${index + 1}`,
            file_type: file.type || 'file',
            file_path: file.path || file.url,
            file_size: file.size,
            type: file.type?.includes('image') ? 'image' : 'file',
            created_at: analysis.created_at
          });
        });
      }
      
      // Check for screenshots or images in the response
      if (results.screenshots && Array.isArray(results.screenshots)) {
        results.screenshots.forEach((screenshot: any, index: number) => {
          attachments.push({
            id: screenshot.id || `${analysis.id}-screenshot-${index}`,
            file_name: screenshot.filename || `Screenshot ${index + 1}`,
            file_path: screenshot.url || screenshot.path,
            file_size: screenshot.size,
            type: 'image',
            created_at: screenshot.created_at || analysis.created_at
          });
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from chat analysis:', error);
  }
  
  return attachments;
};

export const extractScreenshotsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    if (analysis.analysis_results?.screenshots && Array.isArray(analysis.analysis_results.screenshots)) {
      analysis.analysis_results.screenshots.forEach((screenshot: any, index: number) => {
        screenshots.push({
          id: screenshot.id || `${analysis.id}-screenshot-${index}`,
          file_name: screenshot.filename || screenshot.name || `Screenshot ${index + 1}`,
          file_path: screenshot.url || screenshot.path,
          file_size: screenshot.size,
          url: screenshot.original_url,
          created_at: screenshot.created_at || analysis.created_at
        });
      });
    }
    
    // Also check for images in attachments that are screenshots
    const attachments = extractAttachmentsFromChatAnalysis(analysis);
    attachments.forEach(attachment => {
      if (attachment.type === 'image' && 
          (attachment.file_name?.toLowerCase().includes('screenshot') ||
           attachment.file_name?.toLowerCase().includes('capture'))) {
        screenshots.push({
          id: attachment.id,
          file_name: attachment.file_name,
          file_path: attachment.file_path,
          file_size: attachment.file_size,
          created_at: attachment.created_at
        });
      }
    });
  } catch (error) {
    console.warn('Error extracting screenshots from chat analysis:', error);
  }
  
  return screenshots;
};

export const extractAttachmentsFromWizardAnalysis = (analysis: any): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
  try {
    // Extract from wizard analysis structure
    if (analysis.analysis_results) {
      const results = analysis.analysis_results;
      
      // Check for input files or uploads
      if (results.input_files && Array.isArray(results.input_files)) {
        results.input_files.forEach((file: any, index: number) => {
          attachments.push({
            id: file.id || `${analysis.id}-input-${index}`,
            file_name: file.name || file.filename,
            file_type: file.type || file.file_type,
            file_path: file.path || file.url,
            file_size: file.size,
            type: file.type?.includes('image') ? 'image' : 'file',
            created_at: analysis.created_at
          });
        });
      }
      
      // Check for generated screenshots
      if (results.generated_screenshots && Array.isArray(results.generated_screenshots)) {
        results.generated_screenshots.forEach((screenshot: any, index: number) => {
          attachments.push({
            id: screenshot.id || `${analysis.id}-generated-${index}`,
            file_name: screenshot.name || `Generated Screenshot ${index + 1}`,
            file_path: screenshot.url || screenshot.path,
            file_size: screenshot.size,
            type: 'image',
            created_at: screenshot.created_at || analysis.created_at
          });
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from wizard analysis:', error);
  }
  
  return attachments;
};

export const extractScreenshotsFromWizardAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    if (analysis.analysis_results?.generated_screenshots && Array.isArray(analysis.analysis_results.generated_screenshots)) {
      analysis.analysis_results.generated_screenshots.forEach((screenshot: any, index: number) => {
        screenshots.push({
          id: screenshot.id || `${analysis.id}-wizard-screenshot-${index}`,
          file_name: screenshot.name || `Screenshot ${index + 1}`,
          file_path: screenshot.url || screenshot.path,
          file_size: screenshot.size,
          url: screenshot.source_url,
          created_at: screenshot.created_at || analysis.created_at
        });
      });
    }
  } catch (error) {
    console.warn('Error extracting screenshots from wizard analysis:', error);
  }
  
  return screenshots;
};
