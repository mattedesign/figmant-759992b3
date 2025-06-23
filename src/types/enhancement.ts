
export interface AIServiceConfig {
  enabled: boolean;
  apiKeySet: boolean;
  creditCostMultiplier: number;
}

export interface EnhancementSettings {
  googleVision: AIServiceConfig;
  openaiVision: AIServiceConfig;
  amazonRekognition: AIServiceConfig;
  microsoftFormRecognizer: AIServiceConfig;
  tier: 'basic' | 'professional' | 'enterprise';
  autoEnhance: boolean;
}

export interface AnalysisPageEnhancedProps {
  selectedTemplate?: any;
  originalAnalysis?: any;
  showEnhancementDashboard?: boolean;
}

export interface AccessibilityAnalysis {
  contrastRatio: number;
  fontSizeCompliance: boolean;
  colorAccessibilityScore: number;
  adaComplianceLevel: 'A' | 'AA' | 'AAA' | 'non-compliant';
  recommendations: string[];
  confidence: number;
}

export interface DiversityAnalysis {
  inclusivityScore: number;
  demographicRepresentation: {
    age: string[];
    ethnicity: string[];
    gender: string[];
  };
  recommendations: string[];
  confidence: number;
}

export interface FormOptimization {
  conversionPotential: number;
  fieldOptimizations: {
    field: string;
    recommendation: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  mobileUsabilityScore: number;
  recommendations: string[];
  confidence: number;
}

export interface SecondaryAnalysis {
  alternativeROIProjections: {
    conservative: string;
    optimistic: string;
    realistic: string;
  };
  businessImpactVariations: string[];
  designRecommendationComparison: {
    agrees: string[];
    differs: string[];
    additional: string[];
  };
  confidence: number;
}

export interface EnhancedAnalysisResult {
  accessibility_score?: AccessibilityAnalysis;
  diversity_analysis?: DiversityAnalysis;
  form_optimization?: FormOptimization;
  secondary_analysis?: SecondaryAnalysis;
  enhancementMetadata: {
    servicesUsed: string[];
    totalAdditionalCredits: number;
    processingTime: number;
    consensusScore: number;
  };
}

export interface CostCalculation {
  baseCredits: number;
  enhancementCredits: number;
  totalCredits: number;
  breakdown: {
    service: string;
    credits: number;
  }[];
}
