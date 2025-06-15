
export interface ContentAnalysis {
  textKeywords: string[];
  imageTypes: string[];
  analysisIntent: string;
  confidenceScore: number;
  suggestedCategory: string;
  suggestedAnalysisType: string;
}

export interface UserInput {
  message: string;
  attachments?: Array<{
    type: 'file' | 'url';
    name?: string;
    url?: string;
    mimeType?: string;
  }>;
}

export class ContentAnalyzer {
  private static readonly CATEGORY_KEYWORDS = {
    master: [
      'comprehensive', 'complete', 'full analysis', 'everything', 'all aspects',
      'thorough', 'detailed review', 'overall assessment', 'holistic'
    ],
    competitor: [
      'competitor', 'competition', 'compare', 'versus', 'vs', 'benchmark',
      'market analysis', 'competitive', 'rival', 'alternative', 'similar'
    ],
    visual_hierarchy: [
      'hierarchy', 'layout', 'visual flow', 'structure', 'organization',
      'navigation', 'information architecture', 'user flow', 'wireframe',
      'placement', 'positioning', 'visual weight', 'focal point'
    ],
    copy_messaging: [
      'copy', 'text', 'messaging', 'content', 'headline', 'tagline',
      'value proposition', 'communication', 'wording', 'language',
      'tone', 'voice', 'clarity', 'readability'
    ],
    ecommerce_revenue: [
      'ecommerce', 'revenue', 'conversion', 'sales', 'checkout', 'cart',
      'product page', 'pricing', 'purchase', 'buy', 'shop', 'store',
      'payment', 'commerce', 'monetization'
    ],
    ab_testing: [
      'a/b test', 'ab test', 'test', 'experiment', 'variant', 'version',
      'compare designs', 'split test', 'optimize', 'performance'
    ],
    premium: [
      'premium', 'advanced', 'enterprise', 'professional', 'high-end',
      'luxury', 'sophisticated', 'exclusive', 'elite'
    ]
  };

  private static readonly ANALYSIS_TYPE_KEYWORDS = {
    usability: [
      'usability', 'user experience', 'ux', 'ease of use', 'intuitive',
      'user-friendly', 'accessibility', 'navigation', 'interaction'
    ],
    conversion: [
      'conversion', 'cro', 'optimize', 'funnel', 'lead generation',
      'sign up', 'subscribe', 'download', 'register'
    ],
    visual: [
      'visual', 'design', 'aesthetic', 'beautiful', 'clean', 'modern',
      'color', 'typography', 'spacing', 'alignment'
    ],
    content: [
      'content', 'copy', 'text', 'message', 'communication', 'headline'
    ],
    mobile: [
      'mobile', 'responsive', 'phone', 'tablet', 'touch', 'mobile-first'
    ],
    performance: [
      'performance', 'speed', 'loading', 'optimization', 'fast', 'slow'
    ]
  };

  private static readonly IMAGE_TYPE_PATTERNS = {
    landing_page: ['landing', 'hero', 'homepage', 'main page'],
    product_page: ['product', 'item', 'catalog', 'detail'],
    checkout: ['checkout', 'cart', 'payment', 'billing'],
    signup: ['signup', 'register', 'form', 'onboarding'],
    dashboard: ['dashboard', 'admin', 'panel', 'analytics'],
    mobile: ['mobile', 'phone', 'app', 'ios', 'android'],
    wireframe: ['wireframe', 'mockup', 'prototype', 'sketch'],
    website: ['website', 'web', 'site', 'page']
  };

  static analyzeContent(input: UserInput): ContentAnalysis {
    const message = input.message.toLowerCase();
    const attachments = input.attachments || [];

    // Analyze text for keywords
    const textKeywords = this.extractKeywords(message);
    
    // Analyze images for types
    const imageTypes = this.analyzeImages(attachments);
    
    // Determine analysis intent
    const analysisIntent = this.determineAnalysisIntent(message, textKeywords);
    
    // Calculate category scores
    const categoryScores = this.calculateCategoryScores(message, textKeywords, imageTypes);
    
    // Calculate analysis type scores
    const analysisTypeScores = this.calculateAnalysisTypeScores(message, textKeywords);
    
    // Get best matches
    const suggestedCategory = this.getBestMatch(categoryScores);
    const suggestedAnalysisType = this.getBestMatch(analysisTypeScores);
    
    // Calculate overall confidence
    const confidenceScore = this.calculateConfidence(categoryScores, analysisTypeScores, textKeywords);

    return {
      textKeywords,
      imageTypes,
      analysisIntent,
      confidenceScore,
      suggestedCategory,
      suggestedAnalysisType
    };
  }

  private static extractKeywords(message: string): string[] {
    const keywords: string[] = [];
    
    // Check all category keywords
    Object.values(this.CATEGORY_KEYWORDS).flat().forEach(keyword => {
      if (message.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    // Check analysis type keywords
    Object.values(this.ANALYSIS_TYPE_KEYWORDS).flat().forEach(keyword => {
      if (message.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return keywords;
  }

  private static analyzeImages(attachments: UserInput['attachments']): string[] {
    if (!attachments) return [];
    
    const imageTypes: string[] = [];
    
    attachments.forEach(attachment => {
      const fileName = (attachment.name || '').toLowerCase();
      const url = (attachment.url || '').toLowerCase();
      const searchText = `${fileName} ${url}`;
      
      // Check for image type patterns
      Object.entries(this.IMAGE_TYPE_PATTERNS).forEach(([type, patterns]) => {
        patterns.forEach(pattern => {
          if (searchText.includes(pattern)) {
            imageTypes.push(type);
          }
        });
      });
      
      // Determine if it's an image attachment
      if (attachment.type === 'file' && 
          (attachment.mimeType?.startsWith('image/') || 
           fileName.match(/\.(jpg|jpeg|png|gif|webp)$/))) {
        imageTypes.push('design_screenshot');
      }
    });
    
    return [...new Set(imageTypes)]; // Remove duplicates
  }

  private static determineAnalysisIntent(message: string, keywords: string[]): string {
    if (message.includes('analyze') || message.includes('review')) {
      return 'analysis';
    }
    if (message.includes('improve') || message.includes('optimize')) {
      return 'optimization';
    }
    if (message.includes('compare') || message.includes('vs')) {
      return 'comparison';
    }
    if (keywords.length > 0) {
      return 'targeted_analysis';
    }
    return 'general_review';
  }

  private static calculateCategoryScores(
    message: string, 
    textKeywords: string[], 
    imageTypes: string[]
  ): Record<string, number> {
    const scores: Record<string, number> = {};
    
    // Initialize scores
    Object.keys(this.CATEGORY_KEYWORDS).forEach(category => {
      scores[category] = 0;
    });
    
    // Score based on text keywords
    Object.entries(this.CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (message.includes(keyword)) {
          scores[category] += 10;
        }
      });
    });
    
    // Boost scores based on image types
    if (imageTypes.includes('product_page') || imageTypes.includes('checkout')) {
      scores.ecommerce_revenue += 15;
    }
    if (imageTypes.includes('mobile')) {
      scores.visual_hierarchy += 10;
    }
    if (imageTypes.includes('wireframe')) {
      scores.visual_hierarchy += 15;
    }
    
    // Special logic for comprehensive analysis
    if (message.includes('everything') || message.includes('comprehensive')) {
      scores.master += 20;
    }
    
    return scores;
  }

  private static calculateAnalysisTypeScores(message: string, textKeywords: string[]): Record<string, number> {
    const scores: Record<string, number> = {};
    
    // Initialize scores
    Object.keys(this.ANALYSIS_TYPE_KEYWORDS).forEach(type => {
      scores[type] = 0;
    });
    
    // Score based on keywords
    Object.entries(this.ANALYSIS_TYPE_KEYWORDS).forEach(([type, keywords]) => {
      keywords.forEach(keyword => {
        if (message.includes(keyword)) {
          scores[type] += 10;
        }
      });
    });
    
    return scores;
  }

  private static getBestMatch(scores: Record<string, number>): string {
    const entries = Object.entries(scores);
    if (entries.length === 0) return 'general';
    
    const sorted = entries.sort(([,a], [,b]) => b - a);
    const topScore = sorted[0][1];
    
    // If no clear winner (top score is 0), return general
    if (topScore === 0) return 'general';
    
    return sorted[0][0];
  }

  private static calculateConfidence(
    categoryScores: Record<string, number>,
    analysisTypeScores: Record<string, number>,
    keywords: string[]
  ): number {
    const maxCategoryScore = Math.max(...Object.values(categoryScores));
    const maxAnalysisScore = Math.max(...Object.values(analysisTypeScores));
    const keywordCount = keywords.length;
    
    // Base confidence on score strength and keyword presence
    let confidence = 0.3; // Base confidence
    
    if (maxCategoryScore > 0) confidence += 0.3;
    if (maxAnalysisScore > 0) confidence += 0.2;
    if (keywordCount > 0) confidence += Math.min(keywordCount * 0.05, 0.2);
    
    return Math.min(confidence, 1.0);
  }
}
