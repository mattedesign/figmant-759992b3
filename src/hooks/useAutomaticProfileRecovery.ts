
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAutomaticProfileRecovery = () => {
  const { user, profile, refetchUserData } = useAuth();
  const { toast } = useToast();
  const [isRecovering, setIsRecovering] = useState(false);
  const recoveryAttempted = useRef(false);
  const maxRecoveryTime = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (maxRecoveryTime.current) {
        clearTimeout(maxRecoveryTime.current);
      }
    };
  }, []);

  useEffect(() => {
    const attemptProfileRecovery = async () => {
      // Only run if user exists but profile is missing, and we haven't already attempted recovery
      if (!user || profile || isRecovering || recoveryAttempted.current) return;

      // Special handling for known problematic user
      if (user.email === 'mbrown@triumphpay.com') {
        console.log('🔄 Detected mbrown@triumphpay.com - using targeted recovery approach...');
      }

      console.log('🔄 User exists but profile missing, attempting automatic recovery...');
      setIsRecovering(true);
      recoveryAttempted.current = true;

      // Set maximum recovery time to prevent infinite loops
      maxRecoveryTime.current = setTimeout(() => {
        console.log('⏰ Recovery timeout reached, stopping recovery process');
        setIsRecovering(false);
        if (user.email === 'mbrown@triumphpay.com') {
          toast({
            title: "Profile Recovery Timeout",
            description: "Recovery process timed out. Please contact support if this issue persists.",
          });
        }
      }, 10000); // 10 second maximum recovery time

      try {
        // First, double-check that profile really doesn't exist
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (existingProfile) {
          console.log('✅ Profile found on retry, refreshing user data...');
          clearTimeout(maxRecoveryTime.current);
          await refetchUserData();
          setIsRecovering(false);
          return;
        }

        console.log('🔧 Profile confirmed missing, creating recovery profile...');

        // Create profile directly with proper error handling
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
            role: 'subscriber'
          });

        if (profileError) {
          console.error('❌ Profile creation failed:', profileError);
          throw profileError;
        }

        // Create subscription record
        await supabase.from('subscriptions').upsert({
          user_id: user.id,
          status: 'inactive'
        });

        // Create user credits
        await supabase.from('user_credits').upsert({
          user_id: user.id,
          current_balance: 5,
          total_purchased: 5,
          total_used: 0
        });

        // Create welcome transaction
        await supabase.from('credit_transactions').insert({
          user_id: user.id,
          transaction_type: 'purchase',
          amount: 5,
          description: 'Welcome bonus - 5 free credits (auto-recovery)',
          created_by: user.id
        });

        // Create onboarding record
        await supabase.from('user_onboarding').upsert({
          user_id: user.id
        });

        console.log('✅ Profile recovery completed successfully');
        
        // Clear timeout and refresh data
        clearTimeout(maxRecoveryTime.current);
        
        // Wait a moment for database consistency
        setTimeout(async () => {
          await refetchUserData();
          setIsRecovering(false);
          
          // Only show success toast for specific users who experienced issues
          if (user.email === 'mbrown@triumphpay.com') {
            toast({
              title: "Profile Recovered Successfully",
              description: "Your profile has been restored with 5 welcome credits!",
            });
          }
        }, 2000);

      } catch (error) {
        console.error('❌ Profile recovery failed:', error);
        clearTimeout(maxRecoveryTime.current);
        setIsRecovering(false);
        
        // Only show error for users who experienced the recovery loop
        if (user.email === 'mbrown@triumphpay.com') {
          toast({
            variant: "destructive",
            title: "Profile Recovery Failed",
            description: "Unable to recover your profile automatically. Please contact support.",
          });
        }
      }
    };

    // Only run recovery attempt after a short delay to allow initial auth to settle
    // and only if we haven't already attempted recovery
    if (!recoveryAttempted.current) {
      const timeout = setTimeout(attemptProfileRecovery, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, profile, refetchUserData, toast, isRecovering]);

  // Reset recovery state when user changes
  useEffect(() => {
    if (user?.id) {
      // Reset recovery state for new user
      recoveryAttempted.current = false;
      setIsRecovering(false);
      if (maxRecoveryTime.current) {
        clearTimeout(maxRecoveryTime.current);
      }
    }
  }, [user?.id]);

  return { isRecovering };
};
