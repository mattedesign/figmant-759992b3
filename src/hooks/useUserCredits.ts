
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserCredits, CreditTransaction, CreateCreditTransactionData } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';

export const useUserCredits = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: credits, isLoading: creditsLoading, error: creditsError } = useQuery({
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

  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData: CreateCreditTransactionData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Start a transaction to update both credits and create transaction record
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let newBalance = 0;
      let newTotalPurchased = 0;
      let newTotalUsed = 0;

      if (currentCredits) {
        newBalance = currentCredits.current_balance;
        newTotalPurchased = currentCredits.total_purchased;
        newTotalUsed = currentCredits.total_used;
      }

      // Calculate new values based on transaction type
      switch (transactionData.transaction_type) {
        case 'purchase':
        case 'refund':
        case 'admin_adjustment':
          newBalance += transactionData.amount;
          if (transactionData.transaction_type === 'purchase') {
            newTotalPurchased += transactionData.amount;
          }
          break;
        case 'usage':
          newBalance -= transactionData.amount;
          newTotalUsed += transactionData.amount;
          break;
      }

      // Prevent negative balance
      if (newBalance < 0) {
        throw new Error('Insufficient credits');
      }

      // Insert or update user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: user.id,
          current_balance: newBalance,
          total_purchased: newTotalPurchased,
          total_used: newTotalUsed
        });

      if (creditsError) throw creditsError;

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: transactionData.transaction_type,
          amount: transactionData.amount,
          description: transactionData.description,
          reference_id: transactionData.reference_id,
          created_by: user.id
        })
        .select()
        .single();

      if (transactionError) throw transactionError;
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      toast({
        title: "Transaction Successful",
        description: "Credit transaction has been processed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to process credit transaction.",
      });
    }
  });

  // Check if user has access (subscription or credits)
  const checkUserAccess = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Check user role, subscription, and credits directly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'owner') {
        return true;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (subscription?.status === 'active' || subscription?.status === 'free') {
        return true;
      }

      const { data: userCredits } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      return (userCredits?.current_balance || 0) > 0;
    } catch (error) {
      console.error('Error checking user access:', error);
      return false;
    }
  };

  // Deduct credits for analysis
  const deductAnalysisCredits = async (creditsToDeduct: number = 1, description: string = 'Design analysis'): Promise<boolean> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      // Check access first
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need an active subscription or credits to perform this action.",
        });
        return false;
      }

      // Check if user is owner or has active subscription (unlimited access)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'owner') {
        return true;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (subscription?.status === 'active' || subscription?.status === 'free') {
        return true;
      }

      // For non-subscribers, deduct credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      const balance = currentCredits?.current_balance || 0;
      if (balance < creditsToDeduct) {
        toast({
          variant: "destructive",
          title: "Insufficient Credits",
          description: "You don't have enough credits for this analysis. Please purchase more credits or upgrade your subscription.",
        });
        return false;
      }

      // Deduct credits using the transaction system
      await createTransactionMutation.mutateAsync({
        user_id: user.id,
        transaction_type: 'usage',
        amount: creditsToDeduct,
        description
      });

      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      return false;
    }
  };

  const useCredits = (amount: number, description: string, referenceId?: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    return createTransactionMutation.mutate({
      user_id: user.id,
      transaction_type: 'usage',
      amount,
      description,
      reference_id: referenceId
    });
  };

  return {
    credits,
    transactions,
    creditsLoading,
    transactionsLoading,
    creditsError,
    createTransaction: createTransactionMutation.mutate,
    useCredits,
    checkUserAccess,
    deductAnalysisCredits,
    isProcessing: createTransactionMutation.isPending
  };
};
