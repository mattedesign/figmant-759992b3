
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
      const { profile: profileData, subscription: subscriptionData } = await authService.fetchUserProfile(userId);
      
      console.log('Fetched user data:', { profileData, subscriptionData });
      
      if (profileData) setProfile(profileData);
      
      // If no subscription data exists, create a default 'free' subscription
      if (subscriptionData) {
        setSubscription(subscriptionData);
      } else {
        console.log('No subscription found, creating free subscription for user:', userId);
        // Try to create a free subscription for this user
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              status: 'free'
            })
            .select()
            .single();
          
          if (error) {
            console.error('Error creating free subscription:', error);
            // Set a default free subscription locally if database insert fails
            setSubscription({
              id: 'temp-free',
              user_id: userId,
              status: 'free',
              stripe_customer_id: null,
              stripe_subscription_id: null,
              current_period_start: null,
              current_period_end: null
            });
          } else {
            setSubscription(data);
          }
        } catch (createError) {
          console.error('Failed to create subscription:', createError);
          // Fallback: set a local free subscription
          setSubscription({
            id: 'temp-free',
            user_id: userId,
            status: 'free',
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
          // Fetch user profile data when user is authenticated
          setTimeout(() => {
            updateUserData(session.user.id);
          }, 0);
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
        updateUserData(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isOwner = profile?.role === 'owner';
  // Updated logic: Now includes 'free' status as having access, plus owners always have access
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'free' || isOwner;

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
