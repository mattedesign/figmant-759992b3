
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserDebugInfo = () => {
  return useQuery({
    queryKey: ['user-debug-info'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { error: 'No authenticated user', user: null };
      }

      console.log('🔍 Debug: Checking user state for:', user.email);

      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('🔍 Profile:', { profile, profileError });

      // Check user subscription
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 Subscription:', { subscription, subscriptionError });

      // Check user credits
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 Credits:', { credits, creditsError });

      // Check recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      console.log('🔍 Recent transactions:', { transactions, transactionsError });

      // Test access function
      const { data: hasAccess, error: accessError } = await supabase
        .rpc('user_has_access', { user_id: user.id });

      console.log('🔍 User has access:', { hasAccess, accessError });

      return {
        user: {
          id: user.id,
          email: user.email
        },
        profile,
        subscription,
        credits,
        transactions,
        hasAccess,
        errors: {
          profileError,
          subscriptionError,
          creditsError,
          transactionsError,
          accessError
        }
      };
    },
    enabled: true,
    refetchInterval: false
  });
};
