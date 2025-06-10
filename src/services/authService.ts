
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, Subscription } from '@/types/auth';

export const createAuthService = () => {
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string): Promise<{ profile: UserProfile | null; subscription: Subscription | null }> => {
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

      return {
        profile: profileData,
        subscription: subscriptionData
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { profile: null, subscription: null };
    }
  };

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

  const resetPassword = async (email: string) => {
    try {
      console.log('Sending password reset request for email:', email);
      
      // Call our custom edge function instead of the default Supabase method
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description: error.message || "Failed to send password reset email",
        });
        return { error };
      }

      console.log('Password reset response:', data);
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Password reset catch error:', error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Password Update Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
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

  return {
    fetchUserProfile,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut
  };
};
