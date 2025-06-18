
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserDebugInfo = () => {
  return useQuery({
    queryKey: ['user-debug-info'],
    queryFn: async () => {
      console.log('🔍 Starting comprehensive user debug check...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('🔍 No authenticated user found:', { authError });
        return { 
          error: 'No authenticated user', 
          user: null, 
          authError: authError?.message 
        };
      }

      console.log('🔍 Debug: Checking user state for:', user.email);
      console.log('🔍 User ID:', user.id);

      const debugData = {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        profile: null,
        subscription: null,
        credits: null,
        transactions: [],
        hasAccess: false,
        errors: {
          profileError: null,
          subscriptionError: null,
          creditsError: null,
          transactionsError: null,
          accessError: null
        }
      };

      // Check user profile
      try {
        console.log('🔍 Fetching user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.log('🔍 Profile error:', profileError);
          debugData.errors.profileError = profileError;
        } else {
          console.log('🔍 Profile found:', profile);
          debugData.profile = profile;
        }
      } catch (error) {
        console.log('🔍 Profile fetch exception:', error);
        debugData.errors.profileError = error;
      }

      // Check user subscription
      try {
        console.log('🔍 Fetching user subscription...');
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscriptionError) {
          console.log('🔍 Subscription error:', subscriptionError);
          debugData.errors.subscriptionError = subscriptionError;
        } else {
          console.log('🔍 Subscription found:', subscription);
          debugData.subscription = subscription;
        }
      } catch (error) {
        console.log('🔍 Subscription fetch exception:', error);
        debugData.errors.subscriptionError = error;
      }

      // Check user credits
      try {
        console.log('🔍 Fetching user credits...');
        const { data: credits, error: creditsError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creditsError) {
          console.log('🔍 Credits error:', creditsError);
          debugData.errors.creditsError = creditsError;
        } else {
          console.log('🔍 Credits found:', credits);
          debugData.credits = credits;
        }
      } catch (error) {
        console.log('🔍 Credits fetch exception:', error);
        debugData.errors.creditsError = error;
      }

      // Check recent transactions
      try {
        console.log('🔍 Fetching recent transactions...');
        const { data: transactions, error: transactionsError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.log('🔍 Transactions error:', transactionsError);
          debugData.errors.transactionsError = transactionsError;
        } else {
          console.log('🔍 Transactions found:', transactions?.length || 0);
          debugData.transactions = transactions || [];
        }
      } catch (error) {
        console.log('🔍 Transactions fetch exception:', error);
        debugData.errors.transactionsError = error;
      }

      // Test access function
      try {
        console.log('🔍 Testing user access function...');
        const { data: hasAccess, error: accessError } = await supabase
          .rpc('user_has_access', { user_id: user.id });

        if (accessError) {
          console.log('🔍 Access check error:', accessError);
          debugData.errors.accessError = accessError;
        } else {
          console.log('🔍 User has access result:', hasAccess);
          debugData.hasAccess = hasAccess;
        }
      } catch (error) {
        console.log('🔍 Access check exception:', error);
        debugData.errors.accessError = error;
      }

      console.log('🔍 Complete debug data:', debugData);
      return debugData;
    },
    enabled: true,
    refetchInterval: false,
    retry: 1
  });
};
