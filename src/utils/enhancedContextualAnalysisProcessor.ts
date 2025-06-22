
import { AnalysisAttachment, ContextualRecommendation, ContextualAnalysisResult, AnalysisSummaryMetrics } from '@/types/contextualAnalysis';

/**
 * Enhanced processor for converting raw Claude analysis into structured recommendations
 */
export class EnhancedContextualAnalysisProcessor {
  
  /**
   * Main method to process Claude's analysis response into structured format
   */
  static processAnalysisResponse(
    analysisResponse: string,
    attachments: AnalysisAttachment[],
    analysisType: string,
    projectName: string
  ): ContextualAnalysisResult {
    const recommendations = this.extractRecommendations(analysisResponse, attachments);
    const metrics = this.calculateMetrics(recommendations, attachments);
    
    return {
      id: `analysis-${Date.now()}`,
      summary: this.extractSummary(analysisResponse),
      recommendations,
      attachments,
      metrics,
      createdAt: new Date().toISOString(),
      analysisType
    };
  }

  /**
   * Extract structured recommendations from Claude's text response
   */
  private static extractRecommendations(
    analysisResponse: string,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];
    
    // Split by common section markers
    const sections = this.splitIntoSections(analysisResponse);
    
    sections.forEach((section, index) => {
      if (this.isRecommendationSection(section)) {
        const recommendation = this.parseRecommendationSection(section, index, attachments);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    // If no structured recommendations found, create from paragraphs
    if (recommendations.length === 0) {
      return this.createRecommendationsFromParagraphs(analysisResponse, attachments);
    }

    return recommendations;
  }

  /**
   * Split analysis into logical sections based on markers
   */
  private static splitIntoSections(text: string): string[] {
    // Common section markers in Claude responses
    const sectionMarkers = [
      /^\d+\.\s+/gm,           // "1. ", "2. ", etc.
      /^#{1,3}\s+/gm,          // Markdown headers
      /^\*\*[^*]+\*\*$/gm,     // Bold headers
      /^[A-Z][^:]+:$/gm,       // Title case headers ending with colon
      /^-\s+/gm                // Bullet points
    ];

    let sections = [text];
    
    sectionMarkers.forEach(marker => {
      sections = sections.flatMap(section => 
        section.split(marker).filter(s => s.trim().length > 50)
      );
    });

    return sections.filter(section => section.trim().length > 100);
  }

  /**
   * Check if a section contains recommendation content
   */
  private static isRecommendationSection(section: string): boolean {
    const recommendationKeywords = [
      'recommend', 'suggest', 'improve', 'optimize', 'enhance', 
      'consider', 'should', 'could', 'would', 'better',
      'issue', 'problem', 'opportunity', 'change'
    ];

    const lowerSection = section.toLowerCase();
    return recommendationKeywords.some(keyword => lowerSection.includes(keyword));
  }

  /**
   * Parse a section into a structured recommendation
   */
  private static parseRecommendationSection(
    section: string,
    index: number,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation | null {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) return null;

    const title = this.extractTitle(lines[0]) || `Recommendation ${index + 1}`;
    const description = section.trim();
    const category = this.categorizeRecommendation(section);
    const priority = this.determinePriority(section);
    const confidence = this.calculateConfidence(section);
    
    return {
      id: `rec-${Date.now()}-${index}`,
      title,
      description,
      category,
      priority,
      confidence,
      relatedAttachmentIds: this.findRelatedAttachments(section, attachments),
      specificFindings: this.extractFindings(section),
      suggestedActions: this.extractActions(section),
      estimatedImpact: this.extractImpact(section)
    };
  }

  /**
   * Extract title from the first line of a section
   */
  private static extractTitle(firstLine: string): string {
    // Remove markdown formatting and numbers
    return firstLine
      .replace(/^\d+\.\s*/, '')
      .replace(/^#+\s*/, '')
      .replace(/^\*\*([^*]+)\*\*/, '$1')
      .replace(/:$/, '')
      .trim()
      .substring(0, 100);
  }

  /**
   * Categorize recommendation based on content
   */
  private static categorizeRecommendation(content: string): ContextualRecommendation['category'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('conversion') || lowerContent.includes('cta') || lowerContent.includes('button')) {
      return 'conversion';
    }
    if (lowerContent.includes('accessibility') || lowerContent.includes('contrast') || lowerContent.includes('screen reader')) {
      return 'accessibility';
    }
    if (lowerContent.includes('performance') || lowerContent.includes('speed') || lowerContent.includes('load')) {
      return 'performance';
    }
    if (lowerContent.includes('brand') || lowerContent.includes('logo') || lowerContent.includes('color')) {
      return 'branding';
    }
    if (lowerContent.includes('content') || lowerContent.includes('copy') || lowerContent.includes('text')) {
      return 'content';
    }
    
    return 'ux';
  }

  /**
   * Determine priority based on urgency indicators
   */
  private static determinePriority(content: string): ContextualRecommendation['priority'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('critical') || lowerContent.includes('urgent') || lowerContent.includes('high impact')) {
      return 'high';
    }
    if (lowerContent.includes('minor') || lowerContent.includes('low impact') || lowerContent.includes('consider')) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Calculate confidence score based on language certainty
   */
  private static calculateConfidence(content: string): number {
    const lowerContent = content.toLowerCase();
    let confidence = 75; // Base confidence
    
    // Increase confidence for definitive language
    if (lowerContent.includes('definitely') || lowerContent.includes('clearly')) confidence += 15;
    if (lowerContent.includes('obviously') || lowerContent.includes('certainly')) confidence += 10;
    
    // Decrease confidence for uncertain language
    if (lowerContent.includes('might') || lowerContent.includes('possibly')) confidence -= 15;
    if (lowerContent.includes('perhaps') || lowerContent.includes('maybe')) confidence -= 10;
    
    return Math.min(95, Math.max(60, confidence));
  }

  /**
   * Find attachments related to this recommendation
   */
  private static findRelatedAttachments(content: string, attachments: AnalysisAttachment[]): string[] {
    const lowerContent = content.toLowerCase();
    const relatedIds: string[] = [];
    
    attachments.forEach(attachment => {
      // Check for direct file name mentions
      if (lowerContent.includes(attachment.name.toLowerCase())) {
        relatedIds.push(attachment.id);
        return;
      }
      
      // Check for domain mentions for URLs
      if (attachment.type === 'url' && attachment.metadata?.domain) {
        if (lowerContent.includes(attachment.metadata.domain.toLowerCase())) {
          relatedIds.push(attachment.id);
          return;
        }
      }
      
      // Contextual matching based on content type
      if (attachment.type === 'image' && (lowerContent.includes('visual') || lowerContent.includes('design'))) {
        relatedIds.push(attachment.id);
      }
    });
    
    return relatedIds;
  }

  /**
   * Extract specific findings from the content
   */
  private static extractFindings(content: string): string[] {
    const findings: string[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const finding = trimmed.replace(/^[•\-*]\s*/, '').trim();
        if (finding.length > 10 && finding.length < 200) {
          findings.push(finding);
        }
      }
    });
    
    return findings.slice(0, 5); // Limit to 5 findings
  }

  /**
   * Extract suggested actions from the content
   */
  private static extractActions(content: string): string[] {
    const actions: string[] = [];
    const actionVerbs = ['change', 'update', 'modify', 'add', 'remove', 'improve', 'optimize'];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (actionVerbs.some(verb => lowerLine.includes(verb))) {
        const cleaned = line.trim().replace(/^[•\-*]\s*/, '');
        if (cleaned.length > 15 && cleaned.length < 200) {
          actions.push(cleaned);
        }
      }
    });
    
    return actions.slice(0, 4); // Limit to 4 actions
  }

  /**
   * Extract impact estimates from the content
   */
  private static extractImpact(content: string): ContextualRecommendation['estimatedImpact'] {
    const lowerContent = content.toLowerCase();
    let implementation: 'easy' | 'medium' | 'complex' = 'medium';
    
    if (lowerContent.includes('simple') || lowerContent.includes('easy') || lowerContent.includes('quick')) {
      implementation = 'easy';
    } else if (lowerContent.includes('complex') || lowerContent.includes('difficult') || lowerContent.includes('significant effort')) {
      implementation = 'complex';
    }
    
    return { implementation };
  }

  /**
   * Create recommendations from paragraphs when no structure is found
   */
  private static createRecommendationsFromParagraphs(
    analysisResponse: string,
    attachments: AnalysisAttachment[]
  ): ContextualRecommendation[] {
    const paragraphs = analysisResponse.split('\n\n').filter(p => p.trim().length > 100);
    
    return paragraphs.slice(0, 6).map((paragraph, index) => ({
      id: `rec-para-${Date.now()}-${index}`,
      title: `Analysis Point ${index + 1}`,
      description: paragraph.trim(),
      category: this.categorizeRecommendation(paragraph),
      priority: this.determinePriority(paragraph),
      confidence: this.calculateConfidence(paragraph),
      relatedAttachmentIds: this.findRelatedAttachments(paragraph, attachments),
      specificFindings: [],
      suggestedActions: [],
      estimatedImpact: { implementation: 'medium' }
    }));
  }

  /**
   * Extract summary from the analysis
   */
  private static extractSummary(analysisResponse: string): string {
    const lines = analysisResponse.split('\n').filter(line => line.trim());
    const firstParagraph = lines.slice(0, 3).join(' ').trim();
    
    if (firstParagraph.length > 200) {
      return firstParagraph.substring(0, 197) + '...';
    }
    
    return firstParagraph || 'Analysis completed successfully.';
  }

  /**
   * Calculate summary metrics
   */
  private static calculateMetrics(
    recommendations: ContextualRecommendation[],
    attachments: AnalysisAttachment[]
  ): AnalysisSummaryMetrics {
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const averageConfidence = recommendations.length > 0 
      ? Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length)
      : 0;
    
    const categoriesIdentified = [...new Set(recommendations.map(r => r.category))];
    
    return {
      totalRecommendations: recommendations.length,
      highPriorityCount,
      averageConfidence,
      attachmentsAnalyzed: attachments.length,
      categoriesIdentified,
      estimatedImplementationTime: this.estimateImplementationTime(recommendations)
    };
  }

  /**
   * Estimate implementation time based on recommendations
   */
  private static estimateImplementationTime(recommendations: ContextualRecommendation[]): string {
    const complexCount = recommendations.filter(r => r.estimatedImpact?.implementation === 'complex').length;
    const totalCount = recommendations.length;
    
    if (complexCount > 3) return '3-4 weeks';
    if (totalCount > 8) return '2-3 weeks';
    if (totalCount > 4) return '1-2 weeks';
    return '3-5 days';
  }
}
