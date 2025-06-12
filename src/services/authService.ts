
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, Subscription } from '@/types/auth';

export const createAuthService = () => {
  const fetchUserProfile = async (userId: string): Promise<{ profile: UserProfile | null; subscription: Subscription | null }> => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      // Fetch user subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Subscription fetch error:', subscriptionError);
      }

      return {
        profile: profileData as UserProfile | null,
        subscription: subscriptionData ? {
          id: subscriptionData.id,
          user_id: subscriptionData.user_id,
          status: subscriptionData.status,
          stripe_customer_id: subscriptionData.stripe_customer_id,
          stripe_subscription_id: subscriptionData.stripe_subscription_id,
          current_period_start: subscriptionData.current_period_start,
          current_period_end: subscriptionData.current_period_end
        } as Subscription : null
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { profile: null, subscription: null };
    }
  };

  return {
    fetchUserProfile
  };
};
