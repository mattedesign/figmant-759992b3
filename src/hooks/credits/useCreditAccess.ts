
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreditAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user has access (subscription or credits)
  const checkUserAccess = async (): Promise<boolean> => {
    if (!user?.id) {
      console.log('🔍 No user ID found for access check');
      return false;
    }
    
    try {
      console.log('🔍 Checking access for user:', user.id);
      
      // Check user role, subscription, and credits directly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('🔍 User profile found:', profile);

      if (profile?.role === 'owner') {
        console.log('🔍 User is owner - has access');
        return true;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 User subscription found:', subscription);

      // FEATURE PARITY: Give subscribers same access as owners
      if (subscription?.status === 'active') {
        console.log('🔍 User has active subscription - full access granted (same as owner)');
        return true;
      }

      // For inactive subscriptions, still check credits
      if (subscription && subscription.status === 'inactive') {
        const { data: userCredits } = await supabase
          .from('user_credits')
          .select('current_balance')
          .eq('user_id', user.id)
          .single();

        console.log('🔍 User credits found:', userCredits);

        const hasCredits = (userCredits?.current_balance || 0) > 0;
        console.log('🔍 User has credits result:', hasCredits);
        
        return hasCredits;
      }

      return false;
    } catch (error) {
      console.error('🔍 Error checking user access:', error);
      return false;
    }
  };

  // Deduct credits for analysis - now always processes transactions for tracking
  const deductAnalysisCredits = async (creditsToDeduct: number = 1, description: string = 'Design analysis'): Promise<boolean> => {
    if (!user?.id) {
      console.error('🔍 No user ID for credit deduction');
      throw new Error('User not authenticated');
    }

    console.log('🔍 Starting credit deduction process...', { 
      userId: user.id, 
      creditsToDeduct, 
      description 
    });

    try {
      // Check access first
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        console.error('🔍 User does not have access');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need an active subscription or credits to perform this action.",
        });
        return false;
      }

      console.log('🔍 Access check passed, proceeding with credit deduction...');

      // Check if user is owner or has active subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      const isOwner = profile?.role === 'owner';
      const hasActiveSubscription = subscription?.status === 'active';

      console.log('🔍 User permissions:', { isOwner, hasActiveSubscription });

      // FEATURE PARITY: Both owners and active subscribers get unlimited access
      if (isOwner || hasActiveSubscription) {
        console.log('🔍 Creating tracking transaction for', isOwner ? 'owner' : 'active subscriber', '- unlimited access');
        // Create a usage transaction for tracking without actually deducting from balance
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'usage',
            amount: creditsToDeduct,
            description: `${description} (${isOwner ? 'Owner' : 'Active Subscriber'} - unlimited access)`,
            created_by: user.id
          });

        if (transactionError) {
          console.error('🔍 Error creating tracking transaction:', transactionError);
        } else {
          console.log('🔍 Usage tracked for', isOwner ? 'owner' : 'active subscriber', '- no credits deducted');
        }

        return true;
      }

      // For inactive subscribers, check and deduct actual credits
      console.log('🔍 User needs to use actual credits, fetching current balance...');
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('current_balance, total_used')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('🔍 Error fetching current credits:', fetchError);
        throw new Error('Unable to fetch credit balance');
      }

      const balance = currentCredits?.current_balance || 0;
      console.log('🔍 Current credit balance:', balance);
      
      if (balance < creditsToDeduct) {
        console.error('🔍 Insufficient credits:', { balance, needed: creditsToDeduct });
        toast({
          variant: "destructive",
          title: "Insufficient Credits",
          description: "You don't have enough credits for this analysis. Please purchase more credits or activate your subscription for unlimited access.",
        });
        return false;
      }

      console.log('🔍 Sufficient credits available, deducting...');

      // Deduct actual credits and create transaction
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          current_balance: balance - creditsToDeduct,
          total_used: (currentCredits?.total_used || 0) + creditsToDeduct,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('🔍 Error updating credits:', updateError);
        throw new Error('Failed to deduct credits');
      }

      console.log('🔍 Credits deducted successfully');

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'usage',
          amount: creditsToDeduct,
          description,
          created_by: user.id
        });

      if (transactionError) {
        console.error('🔍 Error creating transaction:', transactionError);
      } else {
        console.log('🔍 Transaction record created successfully');
      }

      console.log('🔍 Credit deduction completed successfully');
      return true;
    } catch (error) {
      console.error('🔍 Error deducting credits:', error);
      toast({
        variant: "destructive",
        title: "Credit Deduction Failed",
        description: error.message || "Unable to process credit deduction.",
      });
      return false;
    }
  };

  return {
    checkUserAccess,
    deductAnalysisCredits
  };
};
