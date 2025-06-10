
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'subscriber';
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  subscription: Subscription | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refetchUserData: () => Promise<void>;
  isOwner: boolean;
  hasActiveSubscription: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('Profile data received:', profileData);

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscriptionError) {
        console.error('Subscription fetch error:', subscriptionError);
        throw subscriptionError;
      }

      console.log('Subscription data received:', subscriptionData);

      setProfile(profileData);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't clear profile/subscription on error - they might already be set
    }
  };

  const refetchUserData = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
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
            fetchUserProfile(session.user.id);
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
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isOwner = profile?.role === 'owner';
  const hasActiveSubscription = subscription?.status === 'active' || isOwner;

  console.log('Current auth state:', {
    user: user?.id,
    profile: profile?.role,
    subscription: subscription?.status,
    isOwner,
    hasActiveSubscription
  });

  const value = {
    user,
    session,
    profile,
    subscription,
    loading,
    signIn,
    signUp,
    signOut,
    refetchUserData,
    isOwner,
    hasActiveSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
