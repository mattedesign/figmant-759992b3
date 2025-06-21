
import { supabase } from '@/integrations/supabase/client';

export class AccessValidationService {
  
  async getPromptCreditCost(promptId: string): Promise<number> {
    console.log('🔍 Fetching credit cost for prompt:', promptId);
    
    const { data, error } = await supabase
      .from('claude_prompt_examples')
      .select('credit_cost')
      .eq('id', promptId)
      .single();
    
    if (error) {
      console.error('🔍 Error fetching prompt credit cost:', error);
      return 3; // Default fallback
    }
    
    console.log('🔍 Credit cost retrieved:', data.credit_cost);
    return data.credit_cost || 3;
  }

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

    // Get actual credit cost from database
    const creditsRequired = await this.getPromptCreditCost(selectedPrompt.id);
    
    console.log('🔍 ACCESS VALIDATION - Analysis details:', {
      templateId: selectedPrompt.id,
      creditsRequired,
      templateTitle: selectedPrompt.title
    });
    
    const { data: currentCredits } = await supabase
      .from('user_credits')
      .select('current_balance')
      .eq('user_id', user.id)
      .single();

    if (!currentCredits || currentCredits.current_balance < creditsRequired) {
      throw new Error(`Insufficient credits. Premium analysis requires ${creditsRequired} credits. You have ${currentCredits?.current_balance || 0} credits remaining.`);
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from('user_credits')
      .update({ current_balance: currentCredits.current_balance - creditsRequired })
      .eq('user_id', user.id);

    if (deductError) {
      throw new Error('Failed to process credits. Please try again.');
    }

    // Create transaction record using the existing transaction structure
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'usage',
        amount: creditsRequired,
        description: `Premium analysis: ${selectedPrompt.title}`,
        reference_id: selectedPrompt.id,
        created_by: user.id
      });

    if (transactionError) {
      console.error('🔍 Warning: Failed to create transaction record:', transactionError);
      // Don't throw error here as credits are already deducted
    }

    console.log(`🔍 ACCESS VALIDATION - ${creditsRequired} credits deducted successfully`);
    return true;
  }
}

export const useAccessValidationService = () => {
  return new AccessValidationService();
};
