
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserDebugInfo = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-debug-info', user?.id],
    queryFn: async () => {
      if (!user?.email) {
        console.log('🔍 No authenticated user available for debug check');
        return { 
          error: 'No authenticated user', 
          user: null, 
          debugInfo: { noAuthenticatedUser: true }
        };
      }

      console.log(`🔍 Starting comprehensive user debug check for ${user.email}...`);
      
      try {
        // Use the current authenticated user's email
        console.log(`🔍 Fetching profile for ${user.email}...`);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .limit(1);

        console.log('🔍 Profile query result:', { profiles, profilesError });

        if (profilesError) {
          console.log('🔍 Error fetching profile by email:', profilesError);
          return { 
            error: `Error fetching user profile: ${profilesError.message}`, 
            user: null, 
            profilesError: profilesError.message,
            debugInfo: { queryError: profilesError }
          };
        }

        if (!profiles || profiles.length === 0) {
          console.log(`🔍 No profile found for ${user.email}`);
          
          // Try to search for similar emails
          const emailLocalPart = user.email.split('@')[0];
          const { data: similarProfiles, error: searchError } = await supabase
            .from('profiles')
            .select('email, id, role')
            .ilike('email', `%${emailLocalPart}%`)
            .limit(5);

          return { 
            error: `No profile found for ${user.email}`, 
            user: null,
            profilesError: 'User not found in profiles table',
            debugInfo: { 
              searchAttempted: true, 
              similarEmails: similarProfiles?.map(p => p.email) || [],
              searchError: searchError?.message 
            }
          };
        }

        const targetProfile = profiles[0];
        const targetUserId = targetProfile.id;

        console.log(`🔍 Found user profile for ${user.email}:`, targetProfile);
        console.log('🔍 User ID:', targetUserId);

        const debugData = {
          user: {
            id: targetUserId,
            email: targetProfile.email,
            created_at: targetProfile.created_at,
            updated_at: targetProfile.updated_at,
            role: targetProfile.role,
            full_name: targetProfile.full_name
          },
          profile: targetProfile,
          subscription: null,
          credits: null,
          transactions: [],
          hasAccess: false,
          rawQueries: {
            profileQuery: { data: profiles, error: profilesError },
            subscriptionQuery: { data: null, error: null },
            creditsQuery: { data: null, error: null },
            transactionsQuery: { data: null, error: null }
          },
          errors: {
            profileError: null,
            subscriptionError: null,
            creditsError: null,
            transactionsError: null,
            accessError: null
          }
        };

        // Check user subscription with better error handling
        try {
          console.log('🔍 Fetching user subscription for user ID:', targetUserId);
          const { data: subscription, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', targetUserId);

          console.log('🔍 Subscription query result:', { subscription, subscriptionError });

          debugData.rawQueries.subscriptionQuery = { data: subscription, error: subscriptionError };

          if (subscriptionError) {
            console.log('🔍 Subscription error:', subscriptionError);
            debugData.errors.subscriptionError = subscriptionError;
          } else {
            console.log('🔍 Subscription data found:', subscription);
            debugData.subscription = subscription && subscription.length > 0 ? subscription[0] : null;
          }
        } catch (error) {
          console.log('🔍 Subscription fetch exception:', error);
          debugData.errors.subscriptionError = error;
          debugData.rawQueries.subscriptionQuery = { data: null, error: error };
        }

        // Check user credits with better error handling
        try {
          console.log('🔍 Fetching user credits for user ID:', targetUserId);
          const { data: credits, error: creditsError } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', targetUserId);

          console.log('🔍 Credits query result:', { credits, creditsError });

          debugData.rawQueries.creditsQuery = { data: credits, error: creditsError };

          if (creditsError) {
            console.log('🔍 Credits error:', creditsError);
            debugData.errors.creditsError = creditsError;
          } else {
            console.log('🔍 Credits data found:', credits);
            debugData.credits = credits && credits.length > 0 ? credits[0] : null;
          }
        } catch (error) {
          console.log('🔍 Credits fetch exception:', error);
          debugData.errors.creditsError = error;
          debugData.rawQueries.creditsQuery = { data: null, error: error };
        }

        // Check recent transactions with better error handling
        try {
          console.log('🔍 Fetching recent transactions for user ID:', targetUserId);
          const { data: transactions, error: transactionsError } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', targetUserId)
            .order('created_at', { ascending: false })
            .limit(10);

          console.log('🔍 Transactions query result:', { transactions, transactionsError });

          debugData.rawQueries.transactionsQuery = { data: transactions, error: transactionsError };

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
          debugData.rawQueries.transactionsQuery = { data: null, error: error };
        }

        // Test access function with current user context
        try {
          console.log('🔍 Testing user access function for current user...');
          
          const { data: hasAccess, error: accessError } = await supabase
            .rpc('user_has_access', { user_id: targetUserId });

          if (accessError) {
            console.log('🔍 Access check error:', accessError);
            debugData.errors.accessError = accessError;
          } else {
            console.log('🔍 Current user has access result:', hasAccess);
            debugData.hasAccess = hasAccess;
          }
        } catch (error) {
          console.log('🔍 Access check exception:', error);
          debugData.errors.accessError = error;
        }

        console.log(`🔍 Complete debug data for ${user.email}:`, debugData);
        return debugData;

      } catch (globalError) {
        console.error('🔍 Global error in debug function:', globalError);
        return {
          error: `Global debug error: ${globalError.message}`,
          user: null,
          debugInfo: { globalError: globalError.message }
        };
      }
    },
    enabled: !!user?.email, // Only run when we have an authenticated user
    refetchInterval: false,
    retry: 1,
    staleTime: 0, // Always fetch fresh data for debugging
    gcTime: 0 // Don't cache debug data
  });
};
