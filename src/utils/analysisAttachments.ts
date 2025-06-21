
// src/utils/analysisAttachments.ts
// Simplified version that works with existing SavedChatAnalysis interface

import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

// Simple interface that matches what we actually need
export interface SimpleAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
}

// New interfaces for enhanced analysis card
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
  type?: 'file' | 'image' | 'link';
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

// Extract attachments from Chat Analysis - works with existing SavedChatAnalysis type
export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
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
              file_name: att.name || att.file_name || 'Unknown',
              url: att.url,
              type: att.url ? 'link' : 'file',
              link_thumbnail: att.thumbnailUrl || att.screenshot,
              file_path: att.file_path,
              file_size: att.file_size,
              file_type: att.file_type,
              link_title: att.link_title,
              link_description: att.link_description,
              created_at: att.created_at
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
                file_name: hostname,
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
    console.warn('Error extracting attachments from chat analysis:', error);
  }
  
  return attachments;
};

// Extract screenshots from Chat Analysis
export const extractScreenshotsFromChatAnalysis = (analysis: SavedChatAnalysis): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results as any;
      
      // Look for screenshots in various possible locations
      const possibleScreenshots = results.screenshots || 
                                  results.images || 
                                  results.captures || 
                                  [];
      
      if (Array.isArray(possibleScreenshots)) {
        possibleScreenshots.forEach((screenshot: any) => {
          if (screenshot && typeof screenshot === 'object') {
            screenshots.push({
              id: screenshot.id || crypto.randomUUID(),
              file_name: screenshot.file_name || screenshot.name || 'Screenshot',
              file_path: screenshot.file_path || screenshot.url,
              file_size: screenshot.file_size,
              url: screenshot.url,
              created_at: screenshot.created_at
            });
          }
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting screenshots from chat analysis:', error);
  }
  
  return screenshots;
};

// Extract attachments from Wizard Analysis
export const extractAttachmentsFromWizardAnalysis = (analysis: any): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
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
              file_name: item.name || item.file_name || 'File',
              url: item.url,
              type: item.url ? 'link' : 'file',
              link_thumbnail: item.thumbnailUrl,
              file_path: item.file_path,
              file_size: item.file_size,
              file_type: item.file_type,
              link_title: item.link_title,
              link_description: item.link_description,
              created_at: item.created_at
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
                file_name: hostname,
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

// Extract screenshots from Wizard Analysis
export const extractScreenshotsFromWizardAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshots: AnalysisScreenshot[] = [];
  
  try {
    // Check various possible locations for screenshots
    const sources = [
      analysis.screenshots,
      analysis.images,
      analysis.captures,
      analysis.design_uploads
    ];
    
    for (const source of sources) {
      if (Array.isArray(source)) {
        source.forEach((item: any) => {
          if (item && typeof item === 'object') {
            // Check if it looks like an image
            if (item.file_type?.includes('image') || 
                item.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                item.type === 'image') {
              screenshots.push({
                id: item.id || crypto.randomUUID(),
                file_name: item.file_name || item.name || 'Screenshot',
                file_path: item.file_path || item.url,
                file_size: item.file_size,
                url: item.url,
                created_at: item.created_at
              });
            }
          }
        });
        break; // Use first valid source found
      }
    }
  } catch (error) {
    console.warn('Error extracting screenshots from wizard analysis:', error);
  }
  
  return screenshots;
};

// Extract attachments from any analysis type
export const getAttachmentsFromAnalysis = (analysis: any): SimpleAttachment[] => {
  if (!analysis) return [];

  // Handle SavedChatAnalysis type
  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    const attachments = extractAttachmentsFromChatAnalysis(analysis);
    return attachments.map(att => ({
      id: att.id,
      name: att.file_name || att.link_title || 'Attachment',
      url: att.url,
      type: att.type || 'file',
      thumbnailUrl: att.link_thumbnail
    }));
  }
  
  // Handle other analysis types (wizard, design, etc.)
  const attachments = extractAttachmentsFromWizardAnalysis(analysis);
  return attachments.map(att => ({
    id: att.id,
    name: att.file_name || att.link_title || 'Attachment',
    url: att.url,
    type: att.type || 'file',
    thumbnailUrl: att.link_thumbnail
  }));
};

// Get first screenshot/thumbnail for display
export const getFirstScreenshot = (analysis: any): string | null => {
  try {
    const screenshots = analysis.type === 'chat' 
      ? extractScreenshotsFromChatAnalysis(analysis)
      : extractScreenshotsFromWizardAnalysis(analysis);
    
    // Look for any screenshot with a file path or URL
    for (const screenshot of screenshots) {
      if (screenshot.file_path || screenshot.url) {
        return screenshot.file_path || screenshot.url || null;
      }
    }
    
    // Fallback to attachments for images
    const attachments = getAttachmentsFromAnalysis(analysis);
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

// Check if analysis has visual content
export const hasVisualContent = (analysis: any): boolean => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    const screenshots = analysis.type === 'chat' 
      ? extractScreenshotsFromChatAnalysis(analysis)
      : extractScreenshotsFromWizardAnalysis(analysis);
    return attachments.length > 0 || screenshots.length > 0;
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
