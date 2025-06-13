
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserOnboardingState {
  id?: string;
  user_id: string;
  has_seen_welcome_prompt: boolean;
  has_seen_credit_depletion_prompt: boolean;
  first_login_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useUserOnboarding = () => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<UserOnboardingState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOnboardingState = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding state:', error);
        return;
      }

      if (!data) {
        // Create onboarding record if it doesn't exist (for existing users)
        const { data: newRecord, error: createError } = await supabase
          .from('user_onboarding')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) {
          console.error('Error creating onboarding record:', createError);
          return;
        }

        setOnboardingState(newRecord);
      } else {
        setOnboardingState(data);
      }
    } catch (error) {
      console.error('Error in fetchOnboardingState:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingState = async (updates: Partial<UserOnboardingState>) => {
    if (!user?.id || !onboardingState) return;

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating onboarding state:', error);
        return;
      }

      setOnboardingState(data);
    } catch (error) {
      console.error('Error in updateOnboardingState:', error);
    }
  };

  const markWelcomePromptSeen = () => {
    updateOnboardingState({ has_seen_welcome_prompt: true });
  };

  const markCreditDepletionPromptSeen = () => {
    updateOnboardingState({ has_seen_credit_depletion_prompt: true });
  };

  const markFirstLoginCompleted = () => {
    updateOnboardingState({ first_login_completed: true });
  };

  useEffect(() => {
    if (user?.id) {
      fetchOnboardingState();
    } else {
      setOnboardingState(null);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    onboardingState,
    loading,
    markWelcomePromptSeen,
    markCreditDepletionPromptSeen,
    markFirstLoginCompleted,
    refetch: fetchOnboardingState
  };
};
