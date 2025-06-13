
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserCredits, CreditTransaction } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';

export const useCreditQueries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: credits, isLoading: creditsLoading, error: creditsError, refetch: refetchCredits } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      return data as UserCredits | null;
    },
    enabled: !!user?.id
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['credit-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CreditTransaction[];
    },
    enabled: !!user?.id
  });

  return {
    credits,
    transactions,
    creditsLoading,
    transactionsLoading,
    creditsError,
    refetchCredits
  };
};
