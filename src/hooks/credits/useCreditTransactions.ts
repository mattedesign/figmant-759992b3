
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateCreditTransactionData } from '@/types/subscription';
import { useAuth } from '@/contexts/AuthContext';

export const useCreditTransactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    createTransaction: createTransactionMutation.mutate,
    useCredits,
    isProcessing: createTransactionMutation.isPending
  };
};
