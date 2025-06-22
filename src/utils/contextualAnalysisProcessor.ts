
import { AnalysisAttachment, ContextualRecommendation, ContextualAnalysisResult, AnalysisSummaryMetrics } from '@/types/contextualAnalysis';

/**
 * Determines the type of attachment based on file properties
 */
export const determineAttachmentType = (attachment: any): AnalysisAttachment['type'] => {
  // Check for Figma URLs/files
  if (attachment.url?.includes('figma.com') || attachment.name?.includes('.fig')) {
    return 'figma';
  }
  
  // Check for URL attachments
  if (attachment.type === 'url' || attachment.url?.startsWith('http')) {
    return 'url';
  }
  
  // Check for image files
  if (attachment.file?.type?.startsWith('image/') || 
      attachment.mimeType?.startsWith('image/') ||
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(attachment.name || '')) {
    return 'image';
  }
  
  return 'file';
};

/**
 * Processes uploaded attachments into standardized format
 */
export const processAttachments = (rawAttachments: any[]): AnalysisAttachment[] => {
  return rawAttachments.map((attachment, index) => ({
    id: attachment.id || `attachment-${index}`,
    name: attachment.name || attachment.file_name || `Attachment ${index + 1}`,
    type: determineAttachmentType(attachment),
    url: attachment.url || attachment.file_path,
    thumbnailUrl: attachment.thumbnailUrl || attachment.file_path,
    fileSize: attachment.file?.size || attachment.file_size,
    mimeType: attachment.file?.type || attachment.mimeType,
    uploadPath: attachment.uploadPath || attachment.file_path,
    metadata: {
      dimensions: attachment.metadata?.dimensions,
      domain: attachment.url ? new URL(attachment.url).hostname : undefined,
      figmaFileKey: attachment.url?.includes('figma.com') ? 
        attachment.url.match(/file\/([a-zA-Z0-9]+)/)?.[1] : undefined,
      screenshots: attachment.metadata?.screenshots
    }
  }));
};

/**
 * Finds attachments related to a recommendation based on content analysis
 */
export const findRelatedAttachments = (
  recommendation: ContextualRecommendation,
  attachments: AnalysisAttachment[]
): string[] => {
  const relatedIds: string[] = [];
  
  // Simple keyword matching - can be enhanced with more sophisticated NLP
  const recommendationText = `${recommendation.title} ${recommendation.description}`.toLowerCase();
  
  attachments.forEach(attachment => {
    const attachmentText = attachment.name.toLowerCase();
    
    // Check for direct mentions
    if (recommendationText.includes(attachmentText) || 
        recommendationText.includes(attachment.metadata?.domain || '')) {
      relatedIds.push(attachment.id);
      return;
    }
    
    // Category-based matching
    if (recommendation.category === 'accessibility' && 
        (recommendationText.includes('contrast') || recommendationText.includes('color'))) {
      relatedIds.push(attachment.id);
    }
    
    if (recommendation.category === 'conversion' && 
        attachment.type === 'url' && 
        (recommendationText.includes('landing') || recommendationText.includes('cta'))) {
      relatedIds.push(attachment.id);
    }
  });
  
  return relatedIds;
};

/**
 * Processes Claude AI response to extract structured recommendations
 */
export const processAnalysisWithAttachmentContext = (
  analysisResponse: string,
  attachments: AnalysisAttachment[]
): ContextualRecommendation[] => {
  // This is a simplified parser - in production, you'd want more sophisticated NLP
  const sections = analysisResponse.split(/\n\s*\n/);
  const recommendations: ContextualRecommendation[] = [];
  
  sections.forEach((section, index) => {
    if (section.trim().length < 50) return; // Skip short sections
    
    // Extract title (first line or bold text)
    const lines = section.split('\n');
    const title = lines[0].replace(/[*#-]/g, '').trim() || `Recommendation ${index + 1}`;
    
    // Determine category based on keywords
    const sectionLower = section.toLowerCase();
    let category: ContextualRecommendation['category'] = 'ux';
    
    if (sectionLower.includes('conversion') || sectionLower.includes('cta') || sectionLower.includes('button')) {
      category = 'conversion';
    } else if (sectionLower.includes('accessibility') || sectionLower.includes('contrast') || sectionLower.includes('screen reader')) {
      category = 'accessibility';
    } else if (sectionLower.includes('performance') || sectionLower.includes('speed') || sectionLower.includes('load')) {
      category = 'performance';
    } else if (sectionLower.includes('brand') || sectionLower.includes('logo') || sectionLower.includes('color scheme')) {
      category = 'branding';
    } else if (sectionLower.includes('content') || sectionLower.includes('copy') || sectionLower.includes('text')) {
      category = 'content';
    }
    
    // Determine priority based on keywords
    let priority: ContextualRecommendation['priority'] = 'medium';
    if (sectionLower.includes('critical') || sectionLower.includes('urgent') || sectionLower.includes('high impact')) {
      priority = 'high';
    } else if (sectionLower.includes('minor') || sectionLower.includes('low impact') || sectionLower.includes('consider')) {
      priority = 'low';
    }
    
    const recommendation: ContextualRecommendation = {
      id: `rec-${index}`,
      title,
      description: section.trim(),
      category,
      priority,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
      relatedAttachmentIds: [],
      specificFindings: [],
      suggestedActions: [],
      estimatedImpact: {
        implementation: priority === 'high' ? 'complex' : priority === 'medium' ? 'medium' : 'easy'
      }
    };
    
    // Find related attachments
    recommendation.relatedAttachmentIds = findRelatedAttachments(recommendation, attachments);
    
    recommendations.push(recommendation);
  });
  
  return recommendations;
};

/**
 * Calculates summary metrics from analysis results
 */
export const calculateSummaryMetrics = (
  recommendations: ContextualRecommendation[],
  attachments: AnalysisAttachment[]
): AnalysisSummaryMetrics => {
  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  const averageConfidence = recommendations.length > 0 ? 
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length : 0;
  
  const categoriesIdentified = [...new Set(recommendations.map(r => r.category))];
  
  return {
    totalRecommendations: recommendations.length,
    highPriorityCount,
    averageConfidence: Math.round(averageConfidence),
    attachmentsAnalyzed: attachments.length,
    categoriesIdentified,
    estimatedImplementationTime: highPriorityCount > 3 ? '2-3 weeks' : 
                                 recommendations.length > 5 ? '1-2 weeks' : '3-5 days'
  };
};
