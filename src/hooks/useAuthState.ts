
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

  const updateUserData = async (userId: string) => {
    try {
      console.log('Updating user data for:', userId);
      const { profile: profileData, subscription: subscriptionData } = await authService.fetchUserProfile(userId);
      
      console.log('Fetched user data:', { profileData, subscriptionData });
      
      if (profileData) setProfile(profileData);
      
      // If no subscription data exists, create a default 'inactive' subscription
      if (subscriptionData) {
        // Convert to valid subscription status (removed 'free' check since it's no longer valid)
        const validSubscription: Subscription = {
          ...subscriptionData,
          status: subscriptionData.status as 'active' | 'inactive' | 'cancelled' | 'expired'
        };
        setSubscription(validSubscription);
      } else {
        console.log('No subscription found, creating inactive subscription for user:', userId);
        // Try to create an inactive subscription for this user
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
            // Set a default inactive subscription locally if database insert fails
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
          // Fallback: set a local inactive subscription
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
          // Add a small delay to ensure database triggers have completed
          setTimeout(() => {
            updateUserData(session.user.id);
          }, 1000);
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
        // Add a delay here too for initial load
        setTimeout(() => {
          updateUserData(session.user.id);
        }, 1000);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isOwner = profile?.role === 'owner';
  // Updated logic: Now only 'active' subscriptions provide access, plus owners always have access
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
