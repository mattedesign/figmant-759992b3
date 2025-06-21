// src/utils/analysisAttachments.ts
// Complete fixed version with all required exports

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
  type: 'file' | 'link' | 'image';
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

export interface ScreenshotResult {
  success: boolean;
  url: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

// Extract attachments from Chat Analysis
export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
  try {
    // Extract from analysis_results if it contains attachment data
    if (analysis.analysis_results) {
      const results = analysis.analysis_results;
      
      // Check if attachments are stored directly
      if (results.attachments && Array.isArray(results.attachments)) {
        results.attachments.forEach((att: any) => {
          attachments.push({
            id: att.id || crypto.randomUUID(),
            file_name: att.name || att.file_name,
            file_type: att.type || att.file_type,
            file_path: att.uploadPath || att.file_path,
            url: att.url,
            type: att.type === 'url' ? 'link' : 'file',
            created_at: att.created_at || analysis.created_at
          });
        });
      }
      
      // Check if URLs are mentioned in the response
      if (results.response && typeof results.response === 'string') {
        const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
        const urls = results.response.match(urlRegex);
        if (urls) {
          urls.forEach(url => {
            attachments.push({
              id: crypto.randomUUID(),
              url: url,
              link_title: new URL(url).hostname,
              type: 'link',
              created_at: analysis.created_at
            });
          });
        }
      }
    }
    
    // Check metadata for attachments
    if (analysis.metadata) {
      const metadata = analysis.metadata as any;
      if (metadata.attachments && Array.isArray(metadata.attachments)) {
        metadata.attachments.forEach((att: any) => {
          attachments.push({
            id: att.id || crypto.randomUUID(),
            file_name: att.name || att.file_name,
            url: att.url,
            type: att.type || 'file',
            created_at: analysis.created_at
          });
        });
      }
    }
  } catch (error) {
    console.error('Error extracting attachments from chat analysis:', error);
  }
  
  return attachments;
};

// Extract screenshots from Chat Analysis
export const extractScreenshotsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromChatAnalysis(analysis);
    
    attachments.forEach(att => {
      // Check if attachment has screenshot metadata
      if (att.type === 'link' && att.url) {
        // Simulate screenshot data for URLs
        screenshots.push({
          id: crypto.randomUUID(),
          file_name: `${att.link_title || 'screenshot'}.png`,
          url: att.url,
          created_at: att.created_at
        });
      }
      
      // Check for image files
      if (att.type === 'image' || (att.file_type && att.file_type.startsWith('image/'))) {
        screenshots.push({
          id: att.id,
          file_name: att.file_name,
          file_path: att.file_path,
          file_size: att.file_size,
          created_at: att.created_at
        });
      }
    });
  } catch (error) {
    console.error('Error extracting screenshots from chat analysis:', error);
  }
  
  return screenshots;
};

// Extract attachments from Wizard Analysis
export const extractAttachmentsFromWizardAnalysis = (analysis: any): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
  try {
    // Check for batch uploads
    if (analysis.batch_uploads && Array.isArray(analysis.batch_uploads)) {
      analysis.batch_uploads.forEach((upload: any) => {
        attachments.push({
          id: upload.id || crypto.randomUUID(),
          file_name: upload.file_name,
          file_type: upload.file_type,
          file_path: upload.file_path,
          file_size: upload.file_size,
          type: upload.file_type?.startsWith('image/') ? 'image' : 'file',
          created_at: upload.created_at || analysis.created_at
        });
      });
    }
    
    // Check analysis settings for URLs
    if (analysis.analysis_settings) {
      const settings = analysis.analysis_settings;
      if (settings.urls && Array.isArray(settings.urls)) {
        settings.urls.forEach((url: string) => {
          attachments.push({
            id: crypto.randomUUID(),
            url: url,
            link_title: new URL(url).hostname,
            type: 'link',
            created_at: analysis.created_at
          });
        });
      }
    }
  } catch (error) {
    console.error('Error extracting attachments from wizard analysis:', error);
  }
  
  return attachments;
};

// Extract screenshots from Wizard Analysis
export const extractScreenshotsFromWizardAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromWizardAnalysis(analysis);
    
    attachments.forEach(att => {
      if (att.type === 'image' || att.type === 'link') {
        screenshots.push({
          id: att.id,
          file_name: att.file_name || `${att.link_title || 'screenshot'}.png`,
          file_path: att.file_path,
          file_size: att.file_size,
          url: att.url,
          created_at: att.created_at
        });
      }
    });
  } catch (error) {
    console.error('Error extracting screenshots from wizard analysis:', error);
  }
  
  return screenshots;
};

// Main helper function to get attachments from any analysis type
export const getAttachmentsFromAnalysis = (analysis: any): AnalysisAttachment[] => {
  if (!analysis) return [];

  // Determine analysis type and extract accordingly
  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    return extractAttachmentsFromChatAnalysis(analysis);
  }
  
  if (analysis.type === 'wizard' || analysis.batch_id) {
    return extractAttachmentsFromWizardAnalysis(analysis);
  }
  
  // For design analysis or unknown types, try generic extraction
  const attachments: AnalysisAttachment[] = [];
  
  // Check for common attachment patterns
  const possibleAttachments = analysis.attachments || 
                             analysis.files || 
                             analysis.uploads || 
                             analysis.design_uploads ||
                             [];
  
  possibleAttachments.forEach((item: any) => {
    attachments.push({
      id: item.id || crypto.randomUUID(),
      file_name: item.name || item.file_name || 'Unknown File',
      file_type: item.type || item.file_type,
      file_path: item.uploadPath || item.file_path,
      url: item.url,
      type: item.url ? 'link' : 'file',
      created_at: item.created_at || analysis.created_at
    });
  });
  
  return attachments;
};

// Helper function to get the first available screenshot for thumbnail display
export const getFirstScreenshot = (analysis: any): string | null => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  
  // Look for image files first
  for (const attachment of attachments) {
    if (attachment.type === 'image' && attachment.file_path) {
      return attachment.file_path;
    }
  }
  
  // Look for link thumbnails
  for (const attachment of attachments) {
    if (attachment.link_thumbnail) {
      return attachment.link_thumbnail;
    }
  }
  
  return null;
};

// Helper function to get all screenshots from an analysis
export const getAllScreenshots = (analysis: any): AnalysisScreenshot[] => {
  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    return extractScreenshotsFromChatAnalysis(analysis);
  }
  
  if (analysis.type === 'wizard' || analysis.batch_id) {
    return extractScreenshotsFromWizardAnalysis(analysis);
  }
  
  // Generic fallback
  const attachments = getAttachmentsFromAnalysis(analysis);
  return attachments
    .filter(att => att.type === 'image')
    .map(att => ({
      id: att.id,
      file_name: att.file_name,
      file_path: att.file_path,
      file_size: att.file_size,
      url: att.url,
      created_at: att.created_at
    }));
};

// Helper function to get URLs analyzed in an analysis
export const getAnalyzedUrls = (analysis: any): string[] => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  return attachments
    .filter(att => att.type === 'link' && att.url)
    .map(att => att.url!)
    .filter(url => url.length > 0);
};

// Helper function to check if analysis has any visual content
export const hasVisualContent = (analysis: any): boolean => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  return attachments.some(att => att.type === 'image' || att.type === 'link');
};

// Helper function to get analysis summary safely
export const getAnalysisSummary = (analysis: any): string => {
  return analysis.analysis_results?.response || 
         analysis.analysis_results?.analysis || 
         analysis.analysis_results?.summary ||
         analysis.response ||
         analysis.analysis ||
         analysis.summary ||
         'Analysis completed';
};

// Helper function to get analysis title safely
export const getAnalysisTitle = (analysis: any): string => {
  return analysis.title || 
         analysis.analysis_results?.title ||
         (analysis.prompt_used ? analysis.prompt_used.slice(0, 50) + '...' : '') ||
         `${analysis.type || 'Unknown'} Analysis`;
};