
// src/utils/analysisAttachments.ts
// Fixed version to resolve TypeScript errors

export interface ScreenshotResult {
  success: boolean;
  url: string;
  screenshotUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface AnalysisAttachment {
  id: string;
  name: string;
  type: 'url' | 'file';
  url?: string;
  uploadPath?: string;
  metadata?: {
    screenshots?: {
      desktop?: ScreenshotResult;
      mobile?: ScreenshotResult;
    };
  };
}

// Helper function to safely get attachments from different analysis types
export const getAttachmentsFromAnalysis = (analysis: any): AnalysisAttachment[] => {
  if (!analysis) return [];

  // For Chat Analysis (from chat_analysis_history)
  if (analysis.type === 'chat' || analysis.analysis_type === 'chat') {
    // Check multiple possible locations for attachments
    return analysis.attachments || 
           analysis.metadata?.attachments || 
           analysis.analysis_results?.attachments || 
           [];
  }

  // For Design Analysis (from design_analyses table)
  if (analysis.type === 'design' || analysis.analysis_type === 'design') {
    // Design analyses might have uploaded files
    const uploads = analysis.design_uploads || analysis.uploads || [];
    return uploads.map((upload: any) => ({
      id: upload.id || crypto.randomUUID(),
      name: upload.file_name || upload.name || 'Design File',
      type: 'file' as const,
      uploadPath: upload.file_path || upload.uploadPath,
      metadata: upload.metadata
    }));
  }

  // For Wizard/Batch Analysis (from design_batch_analysis)
  if (analysis.type === 'wizard' || analysis.analysis_type === 'wizard' || analysis.batch_id) {
    // Batch analyses might have multiple uploads
    const batchUploads = analysis.batch_uploads || 
                        analysis.uploads || 
                        analysis.analysis_settings?.uploads || 
                        [];
    return batchUploads.map((upload: any) => ({
      id: upload.id || crypto.randomUUID(),
      name: upload.file_name || upload.name || 'Batch Upload',
      type: upload.type || 'file' as const,
      url: upload.url,
      uploadPath: upload.file_path || upload.uploadPath,
      metadata: upload.metadata
    }));
  }

  // Fallback: try to extract from any available data
  const possibleAttachments = analysis.attachments || 
                             analysis.files || 
                             analysis.uploads || 
                             [];
  
  return possibleAttachments.map((item: any) => ({
    id: item.id || crypto.randomUUID(),
    name: item.name || item.file_name || 'Unknown File',
    type: item.type || (item.url ? 'url' : 'file') as const,
    url: item.url,
    uploadPath: item.uploadPath || item.file_path,
    metadata: item.metadata
  }));
};

// Helper function to get the first available screenshot for thumbnail display
export const getFirstScreenshot = (analysis: any): string | null => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  
  for (const attachment of attachments) {
    // Check desktop screenshot first
    if (attachment.metadata?.screenshots?.desktop?.success && 
        attachment.metadata.screenshots.desktop.screenshotUrl) {
      return attachment.metadata.screenshots.desktop.screenshotUrl;
    }
    
    // Check thumbnail version
    if (attachment.metadata?.screenshots?.desktop?.thumbnailUrl) {
      return attachment.metadata.screenshots.desktop.thumbnailUrl;
    }
    
    // Check mobile screenshot as fallback
    if (attachment.metadata?.screenshots?.mobile?.success && 
        attachment.metadata.screenshots.mobile.screenshotUrl) {
      return attachment.metadata.screenshots.mobile.screenshotUrl;
    }
    
    // Check mobile thumbnail
    if (attachment.metadata?.screenshots?.mobile?.thumbnailUrl) {
      return attachment.metadata.screenshots.mobile.thumbnailUrl;
    }
  }
  
  return null;
};

// Helper function to get all screenshots from an analysis
export const getAllScreenshots = (analysis: any): ScreenshotResult[] => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  const screenshots: ScreenshotResult[] = [];
  
  attachments.forEach(attachment => {
    if (attachment.metadata?.screenshots?.desktop?.success) {
      screenshots.push(attachment.metadata.screenshots.desktop);
    }
    if (attachment.metadata?.screenshots?.mobile?.success) {
      screenshots.push(attachment.metadata.screenshots.mobile);
    }
  });
  
  return screenshots;
};

// Helper function to get URLs analyzed in an analysis
export const getAnalyzedUrls = (analysis: any): string[] => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  return attachments
    .filter(att => att.type === 'url' && att.url)
    .map(att => att.url!)
    .filter(url => url.length > 0);
};

// Helper function to check if analysis has any visual content
export const hasVisualContent = (analysis: any): boolean => {
  const attachments = getAttachmentsFromAnalysis(analysis);
  return attachments.some(att => 
    att.type === 'file' || 
    (att.metadata?.screenshots?.desktop?.success || att.metadata?.screenshots?.mobile?.success)
  );
};

// Helper function to get analysis summary safely
export const getAnalysisSummary = (analysis: any): string => {
  // Try different possible locations for analysis content
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
         analysis.prompt_used?.slice(0, 50) + '...' ||
         `${analysis.type || 'Unknown'} Analysis`;
};
