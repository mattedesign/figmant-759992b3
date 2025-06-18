
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreditAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user has access (owners get unlimited, everyone else needs credits)
  const checkUserAccess = async (): Promise<boolean> => {
    if (!user?.id) {
      console.log('🔍 No user ID found for access check');
      return false;
    }
    
    try {
      console.log('🔍 Checking access for user:', user.id);
      
      // Check user role first
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('🔍 User profile found:', profile);

      if (profile?.role === 'owner') {
        console.log('🔍 User is owner - unlimited access');
        return true;
      }

      // For all non-owners, check credits
      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 User credits found:', userCredits);

      const hasCredits = (userCredits?.current_balance || 0) > 0;
      console.log('🔍 User has credits result:', hasCredits);
      
      return hasCredits;
    } catch (error) {
      console.error('🔍 Error checking user access:', error);
      return false;
    }
  };

  // Deduct credits for analysis - pure credit-based system
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
          description: "You need credits to perform this action. Please purchase credits to continue.",
        });
        return false;
      }

      console.log('🔍 Access check passed, proceeding with credit deduction...');

      // Check if user is owner (unlimited access)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isOwner = profile?.role === 'owner';
      console.log('🔍 User permissions:', { isOwner });

      // Owners get unlimited access - just track usage without deducting
      if (isOwner) {
        console.log('🔍 Creating tracking transaction for owner - unlimited access');
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'usage',
            amount: creditsToDeduct,
            description: `${description} (Owner - unlimited access)`,
            created_by: user.id
          });

        if (transactionError) {
          console.error('🔍 Error creating tracking transaction:', transactionError);
        } else {
          console.log('🔍 Usage tracked for owner - no credits deducted');
        }

        return true;
      }

      // For all other users, check and deduct actual credits
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
          description: "You don't have enough credits for this analysis. Please purchase more credits to continue.",
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
          description: description,
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
