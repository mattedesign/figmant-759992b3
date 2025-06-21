
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';

export interface SimpleAttachment {
  id: string;
  name: string;
  url?: string;
  type: 'file' | 'link' | 'image';
  thumbnailUrl?: string;
}

export const extractAttachmentsFromChatAnalysis = (analysis: SavedChatAnalysis): SimpleAttachment[] => {
  const attachments: SimpleAttachment[] = [];
  
  try {
    if (analysis.analysis_results && typeof analysis.analysis_results === 'object') {
      const results = analysis.analysis_results as any;
      
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
      
      if (typeof results.response === 'string') {
        const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
        const urls = results.response.match(urlRegex) || [];
        urls.forEach(url => {
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
    
    if (analysis.metadata && typeof analysis.metadata === 'object') {
      const metadata = analysis.metadata as any;
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

export const getAttachmentsFromAnalysis = (analysis: any): SimpleAttachment[] => {
  if (!analysis) return [];

  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    return extractAttachmentsFromChatAnalysis(analysis);
  }
  
  const attachments: SimpleAttachment[] = [];
  
  try {
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
        break;
      }
    }
    
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

export const getFirstScreenshot = (analysis: any): string | null => {
  try {
    const attachments = getAttachmentsFromAnalysis(analysis);
    
    for (const attachment of attachments) {
      if (attachment.thumbnailUrl) {
        return attachment.thumbnailUrl;
      }
    }
    
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
