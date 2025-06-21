
// Utility functions for extracting and managing analysis attachments

export interface AnalysisAttachment {
  id: string;
  type: 'image' | 'link' | 'file';
  name: string;
  url?: string;
  file?: File;
  status?: 'pending' | 'uploaded' | 'error';
  metadata?: {
    description?: string;
    screenshots?: {
      desktop?: {
        screenshot_url?: string;
      };
    };
  };
  thumbnailUrl?: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  created_at?: string;
}

export interface AnalysisScreenshot {
  id: string;
  url: string;
  type: 'desktop' | 'mobile' | 'tablet';
  timestamp: string;
  name?: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  created_at?: string;
  thumbnailUrl?: string;
}

// Utility function to extract URLs that were analyzed from analysis data
export const getAnalyzedUrls = (analysis: any): string[] => {
  const urls: string[] = [];
  
  try {
    // Check different places where URLs might be stored in analysis results
    const results = analysis.analysis_results || {};
    
    // Check if there are URLs in the analysis response text
    if (results.response) {
      const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
      const foundUrls = results.response.match(urlRegex) || [];
      urls.push(...foundUrls);
    }
    
    // Check if there are explicitly stored URLs
    if (results.analyzed_urls && Array.isArray(results.analyzed_urls)) {
      urls.push(...results.analyzed_urls);
    }
    
    // Check if there are URLs in recommendations
    if (results.recommendations && Array.isArray(results.recommendations)) {
      results.recommendations.forEach((rec: any) => {
        if (rec.reference_url) {
          urls.push(rec.reference_url);
        }
      });
    }
    
    // Remove duplicates and invalid URLs
    return [...new Set(urls)].filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Error extracting URLs from analysis:', error);
    return [];
  }
};

// Extract attachments from analysis data
export const getAttachmentsFromAnalysis = (analysis: any): AnalysisAttachment[] => {
  const attachments: AnalysisAttachment[] = [];
  
  try {
    const results = analysis.analysis_results || {};
    
    // Extract URLs from analyzed content
    const urls = getAnalyzedUrls(analysis);
    urls.forEach((url, index) => {
      attachments.push({
        id: `url-${index}`,
        type: 'link',
        name: new URL(url).hostname,
        url,
        status: 'uploaded',
        metadata: {
          description: `Analyzed website: ${url}`
        },
        file_name: new URL(url).hostname,
        file_path: url,
        created_at: analysis.created_at || new Date().toISOString()
      });
    });
    
    // Extract any file attachments if they exist
    if (results.attachments && Array.isArray(results.attachments)) {
      results.attachments.forEach((attachment: any, index: number) => {
        attachments.push({
          id: `file-${index}`,
          type: attachment.type || 'file',
          name: attachment.name || `Attachment ${index + 1}`,
          url: attachment.url,
          status: 'uploaded',
          metadata: attachment.metadata,
          file_name: attachment.name || `Attachment ${index + 1}`,
          file_path: attachment.url,
          file_size: attachment.file_size,
          created_at: attachment.created_at || analysis.created_at || new Date().toISOString()
        });
      });
    }
    
    return attachments;
  } catch (error) {
    console.error('Error extracting attachments from analysis:', error);
    return [];
  }
};

// Get analysis title from various sources
export const getAnalysisTitle = (analysis: any): string => {
  try {
    // Try different places where title might be stored
    if (analysis.analysis_results?.title) {
      return analysis.analysis_results.title;
    }
    
    if (analysis.analysis_results?.project_name) {
      return analysis.analysis_results.project_name;
    }
    
    if (analysis.prompt_used && typeof analysis.prompt_used === 'string') {
      // Return first 50 characters of prompt as title
      return analysis.prompt_used.length > 50 
        ? analysis.prompt_used.substring(0, 50) + '...'
        : analysis.prompt_used;
    }
    
    // Fallback based on analysis type
    const type = analysis.type || analysis.analysis_type || 'analysis';
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`;
  } catch (error) {
    console.error('Error getting analysis title:', error);
    return 'Analysis';
  }
};

// Get analysis summary/description
export const getAnalysisSummary = (analysis: any): string => {
  try {
    const results = analysis.analysis_results || {};
    
    // Try various summary fields
    if (results.summary) {
      return results.summary;
    }
    
    if (results.description) {
      return results.description;
    }
    
    if (results.response && typeof results.response === 'string') {
      // Return first 200 characters of response
      return results.response.length > 200 
        ? results.response.substring(0, 200) + '...'
        : results.response;
    }
    
    if (analysis.prompt_used && typeof analysis.prompt_used === 'string') {
      return analysis.prompt_used.length > 150 
        ? analysis.prompt_used.substring(0, 150) + '...'
        : analysis.prompt_used;
    }
    
    return 'No summary available';
  } catch (error) {
    console.error('Error getting analysis summary:', error);
    return 'No summary available';
  }
};

// Get first screenshot from analysis
export const getFirstScreenshot = (analysis: any): string | null => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    
    // Find first screenshot/image attachment
    const screenshot = attachments.find(att => 
      att.type === 'image' || 
      att.metadata?.screenshots?.desktop?.screenshot_url
    );
    
    if (screenshot) {
      return screenshot.metadata?.screenshots?.desktop?.screenshot_url || screenshot.url || null;
    }
    
    // Check in analysis results for screenshots
    const results = analysis.analysis_results || {};
    if (results.screenshots && Array.isArray(results.screenshots) && results.screenshots.length > 0) {
      return results.screenshots[0].url || results.screenshots[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting first screenshot:', error);
    return null;
  }
};

// Legacy exports for backward compatibility
export const extractAttachmentsFromChatAnalysis = getAttachmentsFromAnalysis;
export const extractScreenshotsFromChatAnalysis = (analysis: any): AnalysisScreenshot[] => {
  const screenshot = getFirstScreenshot(analysis);
  return screenshot ? [{
    id: 'screenshot-0',
    url: screenshot,
    type: 'desktop',
    timestamp: analysis.created_at || new Date().toISOString(),
    name: 'Screenshot',
    file_name: 'screenshot.png',
    file_path: screenshot,
    created_at: analysis.created_at || new Date().toISOString(),
    thumbnailUrl: screenshot
  }] : [];
};

export const extractAttachmentsFromWizardAnalysis = getAttachmentsFromAnalysis;
export const extractScreenshotsFromWizardAnalysis = extractScreenshotsFromChatAnalysis;
