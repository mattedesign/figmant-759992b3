
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreditAccess } from '@/hooks/credits/useCreditAccess';
import { CreditDepletionPrompt } from '@/components/onboarding/CreditDepletionPrompt';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreditStatusCheckerProps {
  children: React.ReactNode;
}

export const CreditStatusChecker: React.FC<CreditStatusCheckerProps> = ({ children }) => {
  const { user } = useAuth();
  const { checkUserAccess } = useCreditAccess();
  const [showCreditPrompt, setShowCreditPrompt] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState(false);

  // Fetch user credits to show remaining balance
  const { data: userCredits } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user?.id
  });

  // Check user access when component mounts
  useEffect(() => {
    const checkAccessStatus = async () => {
      if (!user?.id || checkedAccess) return;
      
      try {
        console.log('🔍 CREDIT CHECKER - Checking user access status...');
        
        // Check if user is owner first
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'owner') {
          console.log('🔍 CREDIT CHECKER - User is owner, no need to check credits');
          setCheckedAccess(true);
          return;
        }

        // For all other users, check credits only
        const hasAccess = await checkUserAccess();
        
        if (!hasAccess) {
          console.log('🔍 CREDIT CHECKER - User has no access, showing credit prompt');
          setShowCreditPrompt(true);
        } else if (userCredits && userCredits.current_balance <= 2) {
          // Show warning when credits are getting low (2 or fewer)
          console.log('🔍 CREDIT CHECKER - User has low credits, showing warning');
          setShowCreditPrompt(true);
        }
        
        setCheckedAccess(true);
      } catch (error) {
        console.error('🔍 CREDIT CHECKER - Error checking access:', error);
        setCheckedAccess(true);
      }
    };

    checkAccessStatus();
  }, [user?.id, checkUserAccess, userCredits, checkedAccess]);

  const handleCloseCreditPrompt = () => {
    setShowCreditPrompt(false);
  };

  return (
    <>
      {children}
      <CreditDepletionPrompt
        isOpen={showCreditPrompt}
        onClose={handleCloseCreditPrompt}
        remainingCredits={userCredits?.current_balance || 0}
      />
    </>
  );
};
