
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAutomaticProfileRecovery = () => {
  const { user, profile, refetchUserData } = useAuth();
  const { toast } = useToast();
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const attemptProfileRecovery = async () => {
      // Only run if user exists but profile is missing
      if (!user || profile || isRecovering) return;

      console.log('🔄 User exists but profile missing, attempting automatic recovery...');
      setIsRecovering(true);

      try {
        // First, double-check that profile really doesn't exist
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (existingProfile) {
          console.log('✅ Profile found on retry, refreshing user data...');
          await refetchUserData();
          setIsRecovering(false);
          return;
        }

        console.log('🔧 Profile confirmed missing, creating recovery profile...');

        // Use the manual user creation function to fix the missing profile
        const { data, error } = await supabase.rpc('create_user_manual', {
          p_email: user.email || '',
          p_full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          p_role: 'subscriber'
        });

        if (error) {
          console.error('❌ Profile recovery failed:', error);
          
          // If manual creation fails, try direct insert as fallback
          const { error: directInsertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              role: 'subscriber'
            });

          if (directInsertError) {
            console.error('❌ Direct profile insert also failed:', directInsertError);
            throw directInsertError;
          }

          // Create basic subscription and credits manually
          await supabase.from('subscriptions').upsert({
            user_id: user.id,
            status: 'inactive'
          });

          await supabase.from('user_credits').upsert({
            user_id: user.id,
            current_balance: 5,
            total_purchased: 5,
            total_used: 0
          });

          await supabase.from('credit_transactions').insert({
            user_id: user.id,
            transaction_type: 'purchase',
            amount: 5,
            description: 'Welcome bonus - 5 free credits (auto-recovery)',
            created_by: user.id
          });

          await supabase.from('user_onboarding').upsert({
            user_id: user.id
          });
        }

        console.log('✅ Profile recovery completed');
        
        // Refresh user data to pick up the recovered profile
        setTimeout(async () => {
          await refetchUserData();
          toast({
            title: "Profile Recovered",
            description: "Your profile has been automatically recovered with 5 welcome credits!",
          });
        }, 2000);

      } catch (error) {
        console.error('❌ Profile recovery failed:', error);
        toast({
          variant: "destructive",
          title: "Profile Recovery Failed",
          description: "Unable to recover your profile automatically. Please contact support.",
        });
      } finally {
        setIsRecovering(false);
      }
    };

    // Run recovery attempt after a short delay to allow initial auth to settle
    const timeout = setTimeout(attemptProfileRecovery, 3000);

    return () => clearTimeout(timeout);
  }, [user, profile, refetchUserData, toast, isRecovering]);

  return { isRecovering };
};
