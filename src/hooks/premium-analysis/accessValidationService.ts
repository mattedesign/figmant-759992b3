
import { supabase } from '@/integrations/supabase/client';

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

    // For non-owners, check and deduct credits
    const creditsRequired = 5; // Premium analysis costs 5 credits
    
    const { data: currentCredits } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (!currentCredits || currentCredits.credits < creditsRequired) {
      throw new Error(`Insufficient credits. Premium analysis requires ${creditsRequired} credits.`);
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from('user_credits')
      .update({ credits: currentCredits.credits - creditsRequired })
      .eq('user_id', user.id);

    if (deductError) {
      throw new Error('Failed to process credits. Please try again.');
    }

    console.log('🔍 ACCESS VALIDATION - Credits deducted successfully');
    return true;
  }
}

export const useAccessValidationService = () => {
  return new AccessValidationService();
};
