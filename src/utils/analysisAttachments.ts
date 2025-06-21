
// src/utils/analysisAttachments.ts
// Enhanced fixed version with proper handling of stored attachment data

import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

export interface SimpleAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
  file_path?: string;
  path?: string; // Handle stored data structure
  file_name?: string;
  metadata?: any;
}

export interface AnalysisAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
  file_name?: string;
  file_path?: string;
  path?: string;
  file_size?: number;
  created_at?: string;
  metadata?: any;
}

export interface AnalysisScreenshot {
  id: string;
  name: string;
  url?: string;
  thumbnailUrl?: string;
  file_name?: string;
  file_path?: string;
  path?: string;
  file_size?: number;
  created_at?: string;
  metadata?: any;
}

// Enhanced attachment processing with better storage path handling
const processAttachmentData = (att: any): SimpleAttachment => {
  console.log('🔧 PROCESSING ATTACHMENT DATA:', att);
  
  return {
    id: att.id || crypto.randomUUID(),
    name: att.name || att.file_name || att.link_title || att.filename || 'Unknown',
    url: att.url,
    type: determineAttachmentType(att),
    thumbnailUrl: att.thumbnailUrl || att.screenshot || att.thumbnail_url,
    file_path: att.file_path || att.uploadPath,
    path: att.path, // Handle stored data structure
    file_name: att.file_name || att.filename || att.name,
    metadata: att.metadata
  };
};

const determineAttachmentType = (att: any): 'file' | 'link' | 'image' => {
  // Check if it's a URL/link type
  if ((att.url && !att.file_path && !att.path) || att.type === 'url') return 'link';
  
  // Check if it has image-related properties or file types
  if (att.file_type?.startsWith('image/') || 
      att.type?.startsWith('image/') ||
      att.thumbnailUrl || 
      att.screenshot ||
      att.thumbnail_url ||
      att.metadata?.screenshots ||
      att.path?.includes('image') ||
      att.file_path?.includes('image')) {
    return 'image';
  }
  
  // Default to file for uploaded content
  return 'file';
};

// Extract attachments from Chat Analysis - handles type safety issues
export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): SimpleAttachment[] => {
  const attachments: SimpleAttachment[] = [];
  
  try {
    console.log('💬 EXTRACTING FROM CHAT ANALYSIS:', analysis);
    
    // Safely check if analysis_results exists and has data
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results as any;
      
      // Look for attachments in various possible locations
      const possibleAttachments = results.attachments || 
                                 results.files || 
                                 results.uploads || 
                                 [];
      
      if (Array.isArray(possibleAttachments)) {
        possibleAttachments.forEach((att: any) => {
          if (att && typeof att === 'object') {
            attachments.push(processAttachmentData(att));
          }
        });
      }
      
      // Extract URLs from response text if present
      if (typeof results.response === 'string') {
        const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
        const urls = results.response.match(urlRegex) || [];
        urls.forEach(url => {
          // Only add if not already in attachments
          if (!attachments.some(att => att.url === url)) {
            try {
              const hostname = new URL(url).hostname;
              attachments.push({
                id: crypto.randomUUID(),
                name: hostname,
                url: url,
                type: 'link'
              });
            } catch (e) {
              // Invalid URL, skip
            }
          }
        });
      }
    }
    
    // Check metadata if it exists - but safely cast to avoid type errors
    const analysisWithMetadata = analysis as any;
    if (analysisWithMetadata.metadata && typeof analysisWithMetadata.metadata === 'object') {
      const metadata = analysisWithMetadata.metadata as any;
      if (metadata.attachments && Array.isArray(metadata.attachments)) {
        metadata.attachments.forEach((att: any) => {
          if (att && typeof att === 'object') {
            attachments.push(processAttachmentData(att));
          }
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from chat analysis:', error);
  }
  
  console.log('💬 EXTRACTED ATTACHMENTS:', attachments);
  return attachments;
};

// Extract screenshots from Chat Analysis
export const extractScreenshotsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromChatAnalysis(analysis);
    
    attachments.forEach(att => {
      if (att.type === 'image' || att.thumbnailUrl || att.file_path || att.path) {
        screenshots.push({
          id: att.id,
          name: att.name,
          url: att.url,
          thumbnailUrl: att.thumbnailUrl,
          file_name: att.file_name || att.name,
          file_path: att.file_path,
          path: att.path,
          created_at: new Date().toISOString(),
          metadata: att.metadata
        });
      }
    });
  } catch (error) {
    console.warn('Error extracting screenshots from chat analysis:', error);
  }
  
  return screenshots;
};

// Extract attachments from Wizard Analysis
export const extractAttachmentsFromWizardAnalysis = (analysis: any): SimpleAttachment[] => {
  const attachments: SimpleAttachment[] = [];
  
  try {
    console.log('🧙 EXTRACTING FROM WIZARD ANALYSIS:', analysis);
    
    // Check for batch uploads
    if (analysis.batch_uploads && Array.isArray(analysis.batch_uploads)) {
      analysis.batch_uploads.forEach((upload: any) => {
        attachments.push(processAttachmentData(upload));
      });
    }
    
    // Check analysis settings for URLs
    if (analysis.analysis_settings && typeof analysis.analysis_settings === 'object') {
      const settings = analysis.analysis_settings;
      if (settings.urls && Array.isArray(settings.urls)) {
        settings.urls.forEach((url: string) => {
          if (typeof url === 'string' && url.length > 0) {
            try {
              const hostname = new URL(url).hostname;
              attachments.push({
                id: crypto.randomUUID(),
                name: hostname,
                url: url,
                type: 'link'
              });
            } catch (e) {
              // Invalid URL, skip
            }
          }
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from wizard analysis:', error);
  }
  
  console.log('🧙 EXTRACTED ATTACHMENTS:', attachments);
  return attachments;
};

// Extract screenshots from Wizard Analysis
export const extractScreenshotsFromWizardAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromWizardAnalysis(analysis);
    
    attachments.forEach(att => {
      if (att.type === 'image' || att.thumbnailUrl || att.file_path || att.path) {
        screenshots.push({
          id: att.id,
          name: att.name,
          url: att.url,
          thumbnailUrl: att.thumbnailUrl,
          file_name: att.file_name || att.name,
          file_path: att.file_path,
          path: att.path,
          created_at: new Date().toISOString(),
          metadata: att.metadata
        });
      }
    });
  } catch (error) {
    console.warn('Error extracting screenshots from wizard analysis:', error);
  }
  
  return screenshots;
};

// Main function - extract attachments from any analysis type
export const getAttachmentsFromAnalysis = (analysis: any): SimpleAttachment[] => {
  if (!analysis) return [];

  console.log('🔍 GET ATTACHMENTS FROM ANALYSIS:', analysis);

  // Handle SavedChatAnalysis type
  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    return extractAttachmentsFromChatAnalysis(analysis);
  }
  
  // Handle wizard analysis
  if (analysis.type === 'wizard' || analysis.batch_id) {
    return extractAttachmentsFromWizardAnalysis(analysis);
  }
  
  // Handle other analysis types (design, etc.)
  const attachments: SimpleAttachment[] = [];
  
  try {
    // Check various possible locations for attachments
    const sources = [
      analysis.attachments,
      analysis.batch_uploads,
      analysis.uploads,
      analysis.design_uploads,
      analysis.files
    ];
    
    for (const source of sources) {
      if (Array.isArray(source)) {
        source.forEach((item: any) => {
          if (item && typeof item === 'object') {
            attachments.push(processAttachmentData(item));
          }
        });
        break; // Use first valid source found
      }
    }
    
    // Check analysis_settings for URLs
    if (analysis.analysis_settings && typeof analysis.analysis_settings === 'object') {
      const settings = analysis.analysis_settings as any;
      if (Array.isArray(settings.urls)) {
        settings.urls.forEach((url: string) => {
          if (typeof url === 'string' && url.length > 0) {
            try {
              const hostname = new URL(url).hostname;
              attachments.push({
                id: crypto.randomUUID(),
                name: hostname,
                url: url,
                type: 'link'
              });
            } catch (e) {
              // Invalid URL, skip
            }
          }
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from analysis:', error);
  }
  
  console.log('🔍 FINAL EXTRACTED ATTACHMENTS:', attachments);
  return attachments;
};

// Get first screenshot/thumbnail for display
export const getFirstScreenshot = (analysis: any): string | null => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    
    // Look for any attachment with a file_path or path first (uploaded files)
    for (const attachment of attachments) {
      if ((attachment.file_path || attachment.path) && attachment.type === 'image') {
        return attachment.file_path || attachment.path;
      }
    }
    
    // Then look for thumbnails
    for (const attachment of attachments) {
      if (attachment.thumbnailUrl && !attachment.thumbnailUrl.startsWith('blob:')) {
        return attachment.thumbnailUrl;
      }
    }
    
    // For image types, return the URL if it looks like an image and isn't a blob
    for (const attachment of attachments) {
      if (attachment.type === 'image' || 
          (attachment.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url))) {
        if (attachment.url && !attachment.url.startsWith('blob:')) {
          return attachment.url;
        }
      }
    }
  } catch (error) {
    console.warn('Error getting first screenshot:', error);
  }
  
  return null;
};

// Get all screenshots from an analysis
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
    .filter(att => att.type === 'image' || att.thumbnailUrl || att.file_path || att.path)
    .map(att => ({
      id: att.id,
      name: att.name,
      url: att.url,
      thumbnailUrl: att.thumbnailUrl,
      file_name: att.file_name || att.name,
      file_path: att.file_path,
      path: att.path,
      created_at: new Date().toISOString(),
      metadata: att.metadata
    }));
};

// Check if analysis has visual content
export const hasVisualContent = (analysis: any): boolean => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    return attachments.length > 0;
  } catch (error) {
    console.warn('Error checking visual content:', error);
    return false;
  }
};

export const getAnalysisTitle = (analysis: any): string => {
  try {
    if (analysis.title) return analysis.title;
    
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results as any;
      if (results.title) return results.title;
    }
    
    if (analysis.prompt_used && typeof analysis.prompt_used === 'string') {
      return analysis.prompt_used.slice(0, 50) + '...';
    }
    
    const type = analysis.type || analysis.analysis_type || 'Unknown';
    return `${type} Analysis`;
  } catch (error) {
    console.warn('Error getting analysis title:', error);
    return 'Analysis';
  }
};

export const getAnalysisSummary = (analysis: any): string => {
  try {
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results as any;
      if (results.response) return results.response;
      if (results.analysis) return results.analysis;
      if (results.summary) return results.summary;
    }
    
    if (analysis.response) return analysis.response;
    if (analysis.analysis) return analysis.analysis;
    if (analysis.summary) return analysis.summary;
    
    return 'Analysis completed';
  } catch (error) {
    console.warn('Error getting analysis summary:', error);
    return 'Analysis completed';
  }
};

export const getAnalyzedUrls = (analysis: any): string[] => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    return attachments
      .filter(att => att.type === 'link' && att.url)
      .map(att => att.url!)
      .filter(url => url.length > 0);
  } catch (error) {
    console.warn('Error getting analyzed URLs:', error);
    return [];
  }
};
