
import type { EnhancedAnalysisResult, EnhancementSettings, AccessibilityAnalysis, DiversityAnalysis, FormOptimization, SecondaryAnalysis } from '@/types/enhancement';
import { supabase } from '@/integrations/supabase/client';
import { isValidEnhancementSettings } from '@/utils/typeUtils';

export class MultiAIAnalyzer {
  private settings: EnhancementSettings;
  private originalAnalysis: any;

  constructor(settings: EnhancementSettings, originalAnalysis: any) {
    this.settings = settings;
    this.originalAnalysis = originalAnalysis;
  }

  async enhanceAnalysis(): Promise<EnhancedAnalysisResult> {
    const startTime = Date.now();
    const servicesUsed: string[] = [];
    let totalAdditionalCredits = 0;
    
    const results: Partial<EnhancedAnalysisResult> = {
      enhancementMetadata: {
        servicesUsed: [],
        totalAdditionalCredits: 0,
        processingTime: 0,
        consensusScore: 0
      }
    };

    console.log('🔮 MULTI-AI ANALYZER - Starting enhancement process');
    console.log('Settings:', this.settings);

    // Process each enabled AI service
    const enhancementPromises: Promise<any>[] = [];

    if (this.settings.googleVision.enabled) {
      console.log('🔮 Adding Google Vision accessibility analysis');
      enhancementPromises.push(this.analyzeAccessibility());
      servicesUsed.push('Google Vision');
      totalAdditionalCredits += Math.ceil(5 * this.settings.googleVision.creditCostMultiplier);
    }

    if (this.settings.amazonRekognition.enabled) {
      console.log('🔮 Adding Amazon Rekognition diversity analysis');
      enhancementPromises.push(this.analyzeDiversity());
      servicesUsed.push('Amazon Rekognition');
      totalAdditionalCredits += Math.ceil(5 * this.settings.amazonRekognition.creditCostMultiplier);
    }

    if (this.settings.microsoftFormRecognizer.enabled) {
      console.log('🔮 Adding Microsoft Form optimization analysis');
      enhancementPromises.push(this.analyzeFormOptimization());
      servicesUsed.push('Microsoft Form Recognizer');
      totalAdditionalCredits += Math.ceil(5 * this.settings.microsoftFormRecognizer.creditCostMultiplier);
    }

    if (this.settings.openaiVision.enabled) {
      console.log('🔮 Adding OpenAI secondary analysis');
      enhancementPromises.push(this.analyzeSecondaryInsights());
      servicesUsed.push('OpenAI Vision');
      totalAdditionalCredits += Math.ceil(5 * this.settings.openaiVision.creditCostMultiplier);
    }

    // Execute all enhancements in parallel
    try {
      const enhancementResults = await Promise.allSettled(enhancementPromises);
      
      // Process results and add to enhancement object
      let resultIndex = 0;
      
      if (this.settings.googleVision.enabled) {
        const result = enhancementResults[resultIndex++];
        if (result.status === 'fulfilled') {
          results.accessibility_score = result.value;
        }
      }

      if (this.settings.amazonRekognition.enabled) {
        const result = enhancementResults[resultIndex++];
        if (result.status === 'fulfilled') {
          results.diversity_analysis = result.value;
        }
      }

      if (this.settings.microsoftFormRecognizer.enabled) {
        const result = enhancementResults[resultIndex++];
        if (result.status === 'fulfilled') {
          results.form_optimization = result.value;
        }
      }

      if (this.settings.openaiVision.enabled) {
        const result = enhancementResults[resultIndex++];
        if (result.status === 'fulfilled') {
          results.secondary_analysis = result.value;
        }
      }

    } catch (error) {
      console.error('🔮 Enhancement error:', error);
    }

    const processingTime = Date.now() - startTime;
    const consensusScore = this.calculateConsensusScore(results);

    results.enhancementMetadata = {
      servicesUsed,
      totalAdditionalCredits,
      processingTime,
      consensusScore
    };

    console.log('🔮 MULTI-AI ANALYZER - Enhancement complete:', {
      servicesUsed: servicesUsed.length,
      totalCredits: totalAdditionalCredits,
      processingTime,
      consensusScore
    });

    return results as EnhancedAnalysisResult;
  }

  private async analyzeAccessibility(): Promise<AccessibilityAnalysis> {
    // Mock implementation for Google Vision accessibility analysis
    // In production, this would call Google Vision API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    return {
      contrastRatio: 4.5,
      fontSizeCompliance: true,
      colorAccessibilityScore: 85,
      adaComplianceLevel: 'AA',
      recommendations: [
        'Increase contrast ratio on secondary buttons',
        'Add alt text to decorative images',
        'Ensure focus indicators are visible'
      ],
      confidence: 0.92
    };
  }

  private async analyzeDiversity(): Promise<DiversityAnalysis> {
    // Mock implementation for Amazon Rekognition diversity analysis
    // In production, this would call Amazon Rekognition API
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

    return {
      inclusivityScore: 78,
      demographicRepresentation: {
        age: ['Young Adult', 'Middle-aged'],
        ethnicity: ['Diverse', 'Underrepresented groups present'],
        gender: ['Balanced representation']
      },
      recommendations: [
        'Consider including more age diversity in hero images',
        'Add representation of different abilities',
        'Ensure cultural sensitivity in imagery choices'
      ],
      confidence: 0.87
    };
  }

  private async analyzeFormOptimization(): Promise<FormOptimization> {
    // Mock implementation for Microsoft Form Recognizer
    // In production, this would call Microsoft Form Recognizer API
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call

    return {
      conversionPotential: 76,
      fieldOptimizations: [
        {
          field: 'Email input',
          recommendation: 'Add email validation hint',
          impact: 'medium'
        },
        {
          field: 'Password field',
          recommendation: 'Show password strength indicator',
          impact: 'high'
        },
        {
          field: 'Submit button',
          recommendation: 'Make button more prominent with contrasting color',
          impact: 'high'
        }
      ],
      mobileUsabilityScore: 82,
      recommendations: [
        'Reduce form fields to essential only',
        'Add progress indicator for multi-step forms',
        'Optimize button size for mobile touch targets'
      ],
      confidence: 0.89
    };
  }

  private async analyzeSecondaryInsights(): Promise<SecondaryAnalysis> {
    // Mock implementation for OpenAI secondary analysis
    // In production, this would call OpenAI Vision API
    await new Promise(resolve => setTimeout(resolve, 900)); // Simulate API call

    return {
      alternativeROIProjections: {
        conservative: '12-18% conversion improvement',
        optimistic: '25-35% conversion improvement', 
        realistic: '18-25% conversion improvement'
      },
      businessImpactVariations: [
        'Consider seasonal variations in conversion rates',
        'Mobile users may see higher impact than desktop',
        'A/B testing recommended for color scheme changes'
      ],
      designRecommendationComparison: {
        agrees: [
          'Improve call-to-action button visibility',
          'Optimize mobile experience',
          'Enhance visual hierarchy'
        ],
        differs: [
          'Claude suggests blue CTA, secondary analysis recommends green',
          'Different priority on font size adjustments'
        ],
        additional: [
          'Consider adding trust signals near conversion points',
          'Implement progressive disclosure for complex forms',
          'Add social proof elements'
        ]
      },
      confidence: 0.85
    };
  }

  private calculateConsensusScore(results: Partial<EnhancedAnalysisResult>): number {
    // Calculate consensus score based on confidence levels of all analyses
    const confidences: number[] = [];
    
    if (results.accessibility_score) confidences.push(results.accessibility_score.confidence);
    if (results.diversity_analysis) confidences.push(results.diversity_analysis.confidence);
    if (results.form_optimization) confidences.push(results.form_optimization.confidence);
    if (results.secondary_analysis) confidences.push(results.secondary_analysis.confidence);

    if (confidences.length === 0) return 0;

    const averageConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    return Math.round(averageConfidence * 100);
  }

  static async getEnhancementSettings(userId: string): Promise<EnhancementSettings | null> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'ai_enhancement_settings')
        .maybeSingle();

      if (error || !data) {
        console.log('No AI enhancement settings found, using defaults');
        return null;
      }

      // Type-safe parsing with validation
      const settingsData = data.setting_value;
      if (isValidEnhancementSettings(settingsData)) {
        return settingsData;
      }

      console.warn('Invalid enhancement settings format, using defaults');
      return null;
    } catch (error) {
      console.error('Failed to fetch enhancement settings:', error);
      return null;
    }
  }
}
