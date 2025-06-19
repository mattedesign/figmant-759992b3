
export interface PremiumAnalysisCosts {
  templateId: string;
  creditCost: number;
  pricingTier: 'basic' | 'premium';
  estimatedValue: string;
}

export const ANALYSIS_CREDIT_COSTS: Record<string, PremiumAnalysisCosts> = {
  'basic-analysis': {
    templateId: 'basic-analysis',
    creditCost: 3,
    pricingTier: 'basic',
    estimatedValue: '$197'
  },
  'uc-024-competitive-intelligence': {
    templateId: 'uc-024-competitive-intelligence', 
    creditCost: 3,
    pricingTier: 'premium',
    estimatedValue: '$497'
  },
  'design-review': {
    templateId: 'design-review',
    creditCost: 3,
    pricingTier: 'basic',
    estimatedValue: '$197'
  },
  'conversion-optimization': {
    templateId: 'conversion-optimization',
    creditCost: 3,
    pricingTier: 'premium',
    estimatedValue: '$297'
  }
};

export const isPremiumAnalysis = (templateId: string): boolean => {
  const template = ANALYSIS_CREDIT_COSTS[templateId];
  return template?.pricingTier === 'premium';
};

export const getAnalysisCost = (templateId: string): number => {
  const template = ANALYSIS_CREDIT_COSTS[templateId];
  return template?.creditCost || 3;
};

export const getAnalysisValue = (templateId: string): string => {
  const template = ANALYSIS_CREDIT_COSTS[templateId];
  return template?.estimatedValue || '$197';
};

export const validateCreditsForAnalysis = (userCredits: number, templateId: string): boolean => {
  const requiredCredits = getAnalysisCost(templateId);
  return userCredits >= requiredCredits;
};
