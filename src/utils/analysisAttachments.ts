// src/utils/analysisAttachments.ts
// Complete fixed version with all required exports and type safety

import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

export interface SimpleAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
}

export interface AnalysisAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
}

export interface AnalysisScreenshot {
  id: string;
  name: string;
  url?: string;
  thumbnailUrl?: string;
}

// Extract attachments from Chat Analysis - handles type safety issues
export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): SimpleAttachment[] => {
  const attachments: SimpleAttachment[] = [];
  
  try {
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
            attachments.push({
              id: att.id || crypto.randomUUID(),
              name: att.name || att.file_name || 'Unknown',
              url: att.url,
              type: att.url ? 'link' : 'file',
              thumbnailUrl: att.thumbnailUrl || att.screenshot
            });
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
            attachments.push({
              id: att.id || crypto.randomUUID(),
              name: att.name || 'Attachment',
              url: att.url,
              type: att.type || 'file'
            });
          }
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting attachments from chat analysis:', error);
  }
  
  return attachments;
};

// Extract screenshots from Chat Analysis - MISSING EXPORT ADDED
export const extractScreenshotsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromChatAnalysis(analysis);
    
    attachments.forEach(att => {
      if (att.type === 'image' || att.thumbnailUrl) {
        screenshots.push({
          id: att.id,
          name: att.name,
          url: att.url,
          thumbnailUrl: att.thumbnailUrl
        });
      }
    });
  } catch (error) {
    console.warn('Error extracting screenshots from chat analysis:', error);
  }
  
  return screenshots;
};

// Extract attachments from Wizard Analysis - MISSING EXPORT ADDED
export const extractAttachmentsFromWizardAnalysis = (analysis: any): SimpleAttachment[] => {
  const attachments: SimpleAttachment[] = [];
  
  try {
    // Check for batch uploads
    if (analysis.batch_uploads && Array.isArray(analysis.batch_uploads)) {
      analysis.batch_uploads.forEach((upload: any) => {
        attachments.push({
          id: upload.id || crypto.randomUUID(),
          name: upload.file_name || upload.name || 'File',
          url: upload.url,
          type: upload.url ? 'link' : 'file',
          thumbnailUrl: upload.thumbnailUrl
        });
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
  
  return attachments;
};

// Extract screenshots from Wizard Analysis - MISSING EXPORT ADDED
export const extractScreenshotsFromWizardAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    const attachments = extractAttachmentsFromWizardAnalysis(analysis);
    
    attachments.forEach(att => {
      if (att.type === 'image' || att.thumbnailUrl) {
        screenshots.push({
          id: att.id,
          name: att.name,
          url: att.url,
          thumbnailUrl: att.thumbnailUrl
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
            attachments.push({
              id: item.id || crypto.randomUUID(),
              name: item.name || item.file_name || 'File',
              url: item.url,
              type: item.url ? 'link' : 'file',
              thumbnailUrl: item.thumbnailUrl
            });
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
  
  return attachments;
};

// Get first screenshot/thumbnail for display
export const getFirstScreenshot = (analysis: any): string | null => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    
    // Look for any attachment with a thumbnail
    for (const attachment of attachments) {
      if (attachment.thumbnailUrl) {
        return attachment.thumbnailUrl;
      }
    }
    
    // For image types, return the URL if it looks like an image
    for (const attachment of attachments) {
      if (attachment.type === 'image' || 
          (attachment.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url))) {
        return attachment.url || null;
      }
    }
  } catch (error) {
    console.warn('Error getting first screenshot:', error);
  }
  
  return null;
};

// Get all screenshots from an analysis - MISSING EXPORT ADDED
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
    .filter(att => att.type === 'image' || att.thumbnailUrl)
    .map(att => ({
      id: att.id,
      name: att.name,
      url: att.url,
      thumbnailUrl: att.thumbnailUrl
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

// Get analysis title safely
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

// Get analysis summary safely
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

// Get analyzed URLs
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