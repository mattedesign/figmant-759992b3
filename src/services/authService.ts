
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, Subscription } from '@/types/auth';

export const createAuthService = () => {
  const fetchUserProfile = async (userId: string): Promise<{ profile: UserProfile | null; subscription: Subscription | null }> => {
    try {
      // Fetch user profile with all required fields
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

      // Transform profile data to match UserProfile interface with proper null handling
      const transformedProfile = profileData ? {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        role: profileData.role as 'owner' | 'subscriber',
        created_at: profileData.created_at,
        avatar_url: profileData.avatar_url || null,
        address: profileData.address || null,
        city: profileData.city || null,
        country: profileData.country || null
      } as UserProfile : null;

      return {
        profile: transformedProfile,
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
