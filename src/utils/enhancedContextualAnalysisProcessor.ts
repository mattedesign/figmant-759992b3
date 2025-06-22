
import { ContextualAnalysisResult, ContextualRecommendation, AnalysisAttachment, AnalysisSummaryMetrics } from '@/types/contextualAnalysis';

export class EnhancedContextualAnalysisProcessor {
  static processAnalysisResponse(
    analysisText: string,
    attachments: AnalysisAttachment[],
    analysisType: string = 'general',
    projectName: string = 'Analysis'
  ): ContextualAnalysisResult {
    console.log('🔄 Processing enhanced contextual analysis...');
    
    const recommendations = this.extractRecommendations(analysisText, attachments);
    const metrics = this.calculateMetrics(recommendations, attachments);
    
    // Calculate file association rate if we have attachments
    if (attachments.length > 0) {
      const attachmentsWithRecommendations = new Set(
        recommendations.flatMap(rec => rec.relatedAttachmentIds)
      ).size;
      metrics.fileAssociationRate = Math.round((attachmentsWithRecommendations / attachments.length) * 100);
    }

    const result: ContextualAnalysisResult = {
      id: `analysis-${Date.now()}`,
      summary: this.extractSummary(analysisText),
      recommendations,
      attachments,
      metrics,
      createdAt: new Date().toISOString(),
      analysisType
    };

    console.log('✅ Enhanced contextual analysis processed:', {
      recommendationsCount: recommendations.length,
      attachmentsCount: attachments.length,
      fileAssociationRate: metrics.fileAssociationRate
    });

    return result;
  }

  private static extractRecommendations(
    analysisText: string,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Try to parse structured recommendations from the analysis text
    const lines = analysisText.split('\n');
    let currentRecommendation: Partial<ContextualRecommendation> | null = null;
    let recommendationCounter = 1;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for recommendation headers
      if (this.isRecommendationHeader(trimmedLine)) {
        // Save previous recommendation if exists
        if (currentRecommendation && currentRecommendation.title) {
          recommendations.push(this.finalizeRecommendation(currentRecommendation, recommendationCounter++, attachments));
        }
        
        // Start new recommendation
        currentRecommendation = {
          title: this.extractTitle(trimmedLine),
          description: '',
          category: this.determineCategory(trimmedLine),
          priority: this.determinePriority(trimmedLine),
          confidence: this.extractConfidence(trimmedLine),
          relatedAttachmentIds: this.findRelatedAttachments(trimmedLine, attachments),
          specificFindings: [],
          suggestedActions: []
        };
      } else if (currentRecommendation && trimmedLine) {
        // Accumulate description and other details
        if (this.isActionItem(trimmedLine)) {
          currentRecommendation.suggestedActions = currentRecommendation.suggestedActions || [];
          currentRecommendation.suggestedActions.push(trimmedLine.replace(/^[-•*]\s*/, ''));
        } else if (this.isFinding(trimmedLine)) {
          currentRecommendation.specificFindings = currentRecommendation.specificFindings || [];
          currentRecommendation.specificFindings.push(trimmedLine.replace(/^[-•*]\s*/, ''));
        } else {
          currentRecommendation.description += (currentRecommendation.description ? ' ' : '') + trimmedLine;
        }
      }
    }

    // Don't forget the last recommendation
    if (currentRecommendation && currentRecommendation.title) {
      recommendations.push(this.finalizeRecommendation(currentRecommendation, recommendationCounter, attachments));
    }

    // If no structured recommendations found, create general ones
    if (recommendations.length === 0) {
      recommendations.push(...this.createFallbackRecommendations(analysisText, attachments));
    }

    return recommendations;
  }

  private static isRecommendationHeader(line: string): boolean {
    const patterns = [
      /^\d+\.\s+/,  // "1. "
      /^[-•*]\s+/,  // "- " or "• " or "* "
      /recommendation/i,
      /suggestion/i,
      /improve/i,
      /consider/i,
      /^\s*#{1,6}\s+/  // Markdown headers
    ];
    
    return patterns.some(pattern => pattern.test(line));
  }

  private static extractTitle(line: string): string {
    // Remove numbering, bullets, and common prefixes
    return line
      .replace(/^\d+\.\s*/, '')
      .replace(/^[-•*]\s*/, '')
      .replace(/^#{1,6}\s*/, '')
      .replace(/^(recommendation|suggestion):\s*/i, '')
      .trim()
      .substring(0, 100); // Limit title length
  }

  private static determineCategory(text: string): ContextualRecommendation['category'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('conversion') || lowerText.includes('cta') || lowerText.includes('button')) return 'conversion';
    if (lowerText.includes('accessibility') || lowerText.includes('a11y') || lowerText.includes('wcag')) return 'accessibility';
    if (lowerText.includes('performance') || lowerText.includes('speed') || lowerText.includes('loading')) return 'performance';
    if (lowerText.includes('brand') || lowerText.includes('color') || lowerText.includes('logo')) return 'branding';
    if (lowerText.includes('content') || lowerText.includes('text') || lowerText.includes('copy')) return 'content';
    
    return 'ux'; // Default category
  }

  private static determinePriority(text: string): ContextualRecommendation['priority'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('critical') || lowerText.includes('urgent') || lowerText.includes('high')) return 'high';
    if (lowerText.includes('low') || lowerText.includes('minor') || lowerText.includes('nice')) return 'low';
    
    return 'medium'; // Default priority
  }

  private static extractConfidence(text: string): number {
    // Look for confidence indicators in the text
    const confidenceMatch = text.match(/(\d+)%/);
    if (confidenceMatch) {
      return parseInt(confidenceMatch[1], 10);
    }
    
    // Default confidence based on content quality
    const lowerText = text.toLowerCase();
    if (lowerText.includes('data') || lowerText.includes('research') || lowerText.includes('study')) return 90;
    if (lowerText.includes('best practice') || lowerText.includes('standard')) return 85;
    if (lowerText.includes('suggest') || lowerText.includes('consider')) return 70;
    
    return 75; // Default confidence
  }

  private static findRelatedAttachments(text: string, attachments: AnalysisAttachment[]): string[] {
    const relatedIds: string[] = [];
    
    // Look for file name mentions in the text
    attachments.forEach(attachment => {
      const fileName = attachment.name.toLowerCase();
      const baseName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
      
      if (text.toLowerCase().includes(fileName) || text.toLowerCase().includes(baseName)) {
        relatedIds.push(attachment.id);
      }
    });

    // If no specific mentions, associate with all attachments for general recommendations
    if (relatedIds.length === 0 && attachments.length > 0) {
      return [attachments[0].id]; // Associate with first attachment as fallback
    }

    return relatedIds;
  }

  private static isActionItem(line: string): boolean {
    const actionPatterns = [
      /^[-•*]\s*(add|remove|change|update|improve|fix|implement)/i,
      /action/i,
      /should/i,
      /must/i,
      /need to/i
    ];
    
    return actionPatterns.some(pattern => pattern.test(line));
  }

  private static isFinding(line: string): boolean {
    const findingPatterns = [
      /^[-•*]\s*(found|observed|noticed|issue|problem)/i,
      /finding/i,
      /issue/i,
      /problem/i
    ];
    
    return findingPatterns.some(pattern => pattern.test(line));
  }

  private static finalizeRecommendation(
    rec: Partial<ContextualRecommendation>,
    index: number,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation {
    return {
      id: `rec-${index}-${Date.now()}`,
      title: rec.title || `Recommendation ${index}`,
      description: rec.description || 'No description available',
      category: rec.category || 'ux',
      priority: rec.priority || 'medium',
      confidence: rec.confidence || 75,
      relatedAttachmentIds: rec.relatedAttachmentIds || [],
      specificFindings: rec.specificFindings || [],
      suggestedActions: rec.suggestedActions || [],
      estimatedImpact: {
        implementation: 'medium'
      }
    };
  }

  private static createFallbackRecommendations(
    analysisText: string,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation[] {
    // Create a general recommendation from the analysis text
    const attachmentIds = attachments.map(att => att.id);
    
    return [{
      id: `rec-general-${Date.now()}`,
      title: 'General Analysis Insights',
      description: analysisText.substring(0, 500) + (analysisText.length > 500 ? '...' : ''),
      category: 'ux' as const,
      priority: 'medium' as const,
      confidence: 70,
      relatedAttachmentIds: attachmentIds,
      specificFindings: [],
      suggestedActions: [],
      estimatedImpact: {
        implementation: 'medium' as const
      }
    }];
  }

  private static extractSummary(analysisText: string): string {
    // Extract the first paragraph or first 200 characters as summary
    const firstParagraph = analysisText.split('\n\n')[0];
    return firstParagraph.length > 200 
      ? firstParagraph.substring(0, 200) + '...'
      : firstParagraph;
  }

  private static calculateMetrics(
    recommendations: ContextualRecommendation[],
    attachments: AnalysisAttachment[]
  ): AnalysisSummaryMetrics {
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const totalConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0);
    const averageConfidence = recommendations.length > 0 
      ? Math.round(totalConfidence / recommendations.length) 
      : 0;

    const categories = [...new Set(recommendations.map(r => r.category))];
    
    return {
      totalRecommendations: recommendations.length,
      highPriorityCount,
      averageConfidence,
      attachmentsAnalyzed: attachments.length,
      categoriesIdentified: categories,
      estimatedImplementationTime: this.estimateImplementationTime(recommendations)
    };
  }

  private static estimateImplementationTime(recommendations: ContextualRecommendation[]): string {
    const complexCount = recommendations.filter(r => 
      r.estimatedImpact?.implementation === 'complex'
    ).length;
    const mediumCount = recommendations.filter(r => 
      r.estimatedImpact?.implementation === 'medium'
    ).length;
    const easyCount = recommendations.filter(r => 
      r.estimatedImpact?.implementation === 'easy'
    ).length;

    const totalHours = (complexCount * 8) + (mediumCount * 4) + (easyCount * 1);
    
    if (totalHours < 8) return `${totalHours} hours`;
    if (totalHours < 40) return `${Math.ceil(totalHours / 8)} days`;
    return `${Math.ceil(totalHours / 40)} weeks`;
  }
}
