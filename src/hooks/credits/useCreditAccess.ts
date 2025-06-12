
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreditAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user has access (subscription or credits)
  const checkUserAccess = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Check user role, subscription, and credits directly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'owner') {
        return true;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (subscription?.status === 'active') {
        return true;
      }

      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      return (userCredits?.current_balance || 0) > 0;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
    }
  };

  // Deduct credits for analysis
  const deductAnalysisCredits = async (creditsToDeduct: number = 1, description: string = 'Design analysis'): Promise<boolean> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      // Check access first
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need an active subscription or credits to perform this action.",
        });
        return false;
      }

      // Check if user is owner or has active subscription (unlimited access)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'owner') {
        return true;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (subscription?.status === 'active') {
        return true;
      }

      // For non-subscribers, deduct credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      const balance = currentCredits?.current_balance || 0;
      if (balance < creditsToDeduct) {
        toast({
          variant: "destructive",
          title: "Insufficient Credits",
          description: "You don't have enough credits for this analysis. Please purchase more credits or upgrade your subscription.",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  };

  return {
    checkUserAccess,
    deductAnalysisCredits
  };
};
