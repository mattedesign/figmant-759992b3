
import { supabase } from '@/integrations/supabase/client';
import { getAnalysisCost, isPremiumAnalysis } from './creditCostManager';

export class AccessValidationService {
  async validateAndDeductCredits(selectedPrompt: any): Promise<boolean> {
    console.log('🔍 ACCESS VALIDATION - Validating user access for premium analysis...');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Check if user is owner (unlimited access)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'owner') {
      console.log('🔍 ACCESS VALIDATION - Owner detected, unlimited access granted');
      return true;
    }

    // Get credit cost for the specific template
    const creditsRequired = getAnalysisCost(selectedPrompt.id);
    const isPreiumAnalysisType = isPremiumAnalysis(selectedPrompt.id);
    
    console.log('🔍 ACCESS VALIDATION - Analysis details:', {
      templateId: selectedPrompt.id,
      creditsRequired,
      isPremium: isPreiumAnalysisType
    });
    
    const { data: currentCredits } = await supabase
      .from('user_credits')
      .select('current_balance')
      .eq('user_id', user.id)
      .single();

    if (!currentCredits || currentCredits.current_balance < creditsRequired) {
      const analysisType = isPreiumAnalysisType ? 'Premium analysis' : 'Analysis';
      throw new Error(`Insufficient credits. ${analysisType} requires ${creditsRequired} credits. You have ${currentCredits?.current_balance || 0} credits remaining.`);
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from('user_credits')
      .update({ current_balance: currentCredits.current_balance - creditsRequired })
      .eq('user_id', user.id);

    if (deductError) {
      throw new Error('Failed to process credits. Please try again.');
    }

    console.log(`🔍 ACCESS VALIDATION - ${creditsRequired} credits deducted successfully`);
    return true;
  }
}

export const useAccessValidationService = () => {
  return new AccessValidationService();
};
