
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
    const { profile: profileData, subscription: subscriptionData } = await authService.fetchUserProfile(userId);
    if (profileData) setProfile(profileData);
    if (subscriptionData) setSubscription(subscriptionData);
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
  // Updated logic: Now includes 'free' status as having access
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
