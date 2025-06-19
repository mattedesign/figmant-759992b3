
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProfileSync = () => {
  const { user, profile, refetchUserData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const syncUserProfile = async () => {
      if (!user || profile) return;

      console.log('User exists but profile is missing, attempting to sync...');
      
      try {
        // Check if profile exists in database
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!existingProfile) {
          console.log('Creating missing profile for user:', user.email);
          
          // Create the missing profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              role: 'subscriber'
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            return;
          }

          // Check and create subscription record if missing
          const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!existingSubscription) {
            const { error: subscriptionError } = await supabase
              .from('subscriptions')
              .insert({
                user_id: user.id,
                status: 'inactive'
              });

            if (subscriptionError) {
              console.error('Error creating subscription:', subscriptionError);
            }
          }

          // Check and create user credits if missing
          const { data: existingCredits } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!existingCredits) {
            const { error: creditsError } = await supabase
              .from('user_credits')
              .insert({
                user_id: user.id,
                current_balance: 5,
                total_purchased: 5,
                total_used: 0
              });

            if (creditsError) {
              console.error('Error creating user credits:', creditsError);
            } else {
              // Create welcome transaction
              const { error: transactionError } = await supabase
                .from('credit_transactions')
                .insert({
                  user_id: user.id,
                  transaction_type: 'purchase',
                  amount: 5,
                  description: 'Welcome bonus - 5 free credits (profile sync)',
                  created_by: user.id
                });

              if (transactionError) {
                console.error('Error creating transaction:', transactionError);
              }
            }
          }

          // Check and create onboarding record if missing
          const { data: existingOnboarding } = await supabase
            .from('user_onboarding')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!existingOnboarding) {
            const { error: onboardingError } = await supabase
              .from('user_onboarding')
              .insert({
                user_id: user.id
              });

            if (onboardingError) {
              console.error('Error creating onboarding record:', onboardingError);
            }
          }

          // Refresh user data to pick up the new profile
          await refetchUserData();
          
          toast({
            title: "Profile Synchronized",
            description: "Your profile has been set up successfully with 5 welcome credits!",
          });
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
        toast({
          variant: "destructive",
          title: "Profile Sync Error",
          description: "There was an issue setting up your profile. Please refresh the page.",
        });
      }
    };

    syncUserProfile();
  }, [user, profile, refetchUserData, toast]);

  return null;
};
