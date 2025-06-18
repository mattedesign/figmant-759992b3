
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserDebugInfo = () => {
  return useQuery({
    queryKey: ['user-debug-info'],
    queryFn: async () => {
      console.log('🔍 Starting comprehensive user debug check for Mbrown@tfin.com...');
      
      // First, let's find the user by email
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'Mbrown@tfin.com');

      if (profilesError) {
        console.log('🔍 Error fetching profile by email:', profilesError);
        return { 
          error: 'Error fetching user profile', 
          user: null, 
          profilesError: profilesError.message 
        };
      }

      if (!profiles || profiles.length === 0) {
        console.log('🔍 No profile found for Mbrown@tfin.com');
        return { 
          error: 'No profile found for Mbrown@tfin.com', 
          user: null,
          profilesError: 'User not found in profiles table'
        };
      }

      const targetProfile = profiles[0];
      const targetUserId = targetProfile.id;

      console.log('🔍 Debug: Found user profile for Mbrown@tfin.com:', targetProfile);
      console.log('🔍 User ID:', targetUserId);

      const debugData = {
        user: {
          id: targetUserId,
          email: targetProfile.email,
          created_at: targetProfile.created_at,
          updated_at: targetProfile.updated_at
        },
        profile: targetProfile,
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

      // Check user subscription
      try {
        console.log('🔍 Fetching user subscription...');
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', targetUserId)
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
          .eq('user_id', targetUserId)
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
          .eq('user_id', targetUserId)
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
          .rpc('user_has_access', { user_id: targetUserId });

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

      console.log('🔍 Complete debug data for Mbrown@tfin.com:', debugData);
      return debugData;
    },
    enabled: true,
    refetchInterval: false,
    retry: 1
  });
};
