import { supabase } from '@/integrations/supabase/client';

export interface PremiumAnalysisCosts {
  templateId: string;
  creditCost: number;
  pricingTier: 'basic' | 'premium';
  estimatedValue: string;
}

// Keep this as fallback only
const FALLBACK_ANALYSIS_COSTS: Record<string, PremiumAnalysisCosts> = {
  'default': {
    templateId: 'default',
    creditCost: 3,
    pricingTier: 'basic',
    estimatedValue: '$197'
  }
};

export const getAnalysisCost = async (templateId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('claude_prompt_examples')
      .select('credit_cost')
      .eq('id', templateId)
      .single();
    
    if (error) {
      console.error('Error fetching credit cost:', error);
      return 3; // Fallback
    }
    
    return data.credit_cost || 3;
  } catch (error) {
    console.error('Error in getAnalysisCost:', error);
    return 3; // Fallback
  }
};

export const validateCreditsForAnalysis = async (userCredits: number, templateId: string): Promise<boolean> => {
  const requiredCredits = await getAnalysisCost(templateId);
  return userCredits >= requiredCredits;
};

// Update to use database values
export const isPremiumAnalysis = async (templateId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('claude_prompt_examples')
      .select('category, credit_cost')
      .eq('id', templateId)
      .single();
    
    if (error) return false;
    
    // Consider premium if credit cost > 3 or specific categories
    return (data.credit_cost > 3) || ['premium', 'competitor', 'ecommerce_revenue'].includes(data.category);
  } catch (error) {
    return false;
  }
};

export const getAnalysisValue = (templateId: string): string => {
  // This can remain static for now or be made dynamic later
  return '$197';
};
