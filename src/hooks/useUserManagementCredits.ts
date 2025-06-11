
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserCreditsData {
  user_id: string;
  current_balance: number;
  total_purchased: number;
  total_used: number;
}

export const useUserManagementCredits = () => {
  return useQuery({
    queryKey: ['user-management-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select('user_id, current_balance, total_purchased, total_used');
      
      if (error) throw error;
      
      // Convert to a map for easy lookup
      const creditsMap = new Map<string, UserCreditsData>();
      data.forEach(credit => {
        creditsMap.set(credit.user_id, credit);
      });
      
      return creditsMap;
    }
  });
};
