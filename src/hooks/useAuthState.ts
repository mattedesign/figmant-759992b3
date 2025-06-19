
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, Subscription } from '@/types/auth';
import { createAuthService } from '@/services/authService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = createAuthService();

  const updateUserData = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Updating user data for: ${userId}, attempt: ${retryCount + 1}`);
      const { profile: profileData, subscription: subscriptionData } = await authService.fetchUserProfile(userId);
      
      console.log('Fetched user data:', { profileData, subscriptionData });
      
      // If no profile data and this is the first few attempts, retry after a delay
      if (!profileData && retryCount < 3) {
        console.log(`No profile found for user ${userId}, retrying in ${(retryCount + 1) * 2000}ms...`);
        setTimeout(() => {
          updateUserData(userId, retryCount + 1);
        }, (retryCount + 1) * 2000);
        return;
      }
      
      if (profileData) {
        setProfile(profileData);
      } else {
        console.error(`Failed to create/fetch profile for user ${userId} after ${retryCount + 1} attempts`);
      }
      
      // Handle subscription data
      if (subscriptionData) {
        const validSubscription: Subscription = {
          ...subscriptionData,
          status: subscriptionData.status as 'active' | 'inactive' | 'cancelled' | 'expired'
        };
        setSubscription(validSubscription);
      } else {
        console.log('No subscription found, creating inactive subscription for user:', userId);
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              status: 'inactive'
            })
            .select()
            .single();
          
          if (error) {
            console.error('Error creating inactive subscription:', error);
            setSubscription({
              id: 'temp-inactive',
              user_id: userId,
              status: 'inactive',
              stripe_customer_id: null,
              stripe_subscription_id: null,
              current_period_start: null,
              current_period_end: null
            });
          } else {
            const validSubscription: Subscription = {
              ...data,
              status: data.status as 'active' | 'inactive' | 'cancelled' | 'expired'
            };
            setSubscription(validSubscription);
          }
        } catch (createError) {
          console.error('Failed to create subscription:', createError);
          setSubscription({
            id: 'temp-inactive',
            user_id: userId,
            status: 'inactive',
            stripe_customer_id: null,
            stripe_subscription_id: null,
            current_period_start: null,
            current_period_end: null
          });
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      
      // If this is a retry attempt and we still have errors, log more details
      if (retryCount > 0) {
        console.error(`Failed to fetch user data after ${retryCount + 1} attempts:`, error);
      }
    }
  };

  const refetchUserData = async () => {
    if (user?.id) {
      console.log('Refetching user data for:', user.id);
      await updateUserData(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // For new signups, give the database trigger more time to complete
          const delay = event === 'SIGNED_UP' ? 3000 : 1500;
          console.log(`Auth event: ${event}, waiting ${delay}ms before fetching user data`);
          
          setTimeout(() => {
            updateUserData(session.user.id);
          }, delay);
        } else {
          setProfile(null);
          setSubscription(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          updateUserData(session.user.id);
        }, 1500);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isOwner = profile?.role === 'owner';
  const hasActiveSubscription = subscription?.status === 'active' || isOwner;

  console.log('Current auth state:', {
    user: user?.id,
    profile: profile?.role,
    subscription: subscription?.status,
    isOwner,
    hasActiveSubscription
  });

  return {
    user,
    session,
    profile,
    subscription,
    loading,
    refetchUserData,
    isOwner,
    hasActiveSubscription
  };
};
