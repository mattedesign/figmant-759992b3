
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'subscriber';
}

interface UserCredits {
  current_balance: number;
  total_purchased: number;
  total_used: number;
}

export const useCreditTransactionManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const processTransaction = async (
    user: UserProfile,
    credits: UserCredits | null,
    transactionType: 'purchase' | 'admin_adjustment' | 'refund',
    amount: number,
    description: string
  ) => {
    if (!user || amount <= 0) return false;

    setIsLoading(true);
    try {
      // Get current user for created_by
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Create credit transaction first
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: transactionType,
          amount: amount,
          description: description || `${transactionType} by admin`,
          created_by: currentUser.id
        });

      if (transactionError) throw transactionError;

      // Calculate new values
      const currentBalance = credits?.current_balance || 0;
      const totalPurchased = credits?.total_purchased || 0;
      const totalUsed = credits?.total_used || 0;

      let newBalance = currentBalance;
      let newTotalPurchased = totalPurchased;

      if (transactionType === 'purchase' || transactionType === 'admin_adjustment' || transactionType === 'refund') {
        newBalance += amount;
        if (transactionType === 'purchase') {
          newTotalPurchased += amount;
        }
      }

      // Update the existing user_credits record using UPDATE instead of upsert
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          current_balance: newBalance,
          total_purchased: newTotalPurchased,
          total_used: totalUsed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        
        // If update failed because no record exists, create one
        if (updateError.code === 'PGRST116') {
          console.log('No existing record found, creating new user_credits record');
          const { error: insertError } = await supabase
            .from('user_credits')
            .insert({
              user_id: user.id,
              current_balance: newBalance,
              total_purchased: newTotalPurchased,
              total_used: totalUsed
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error(`Failed to create user credits record: ${insertError.message}`);
          }
        } else {
          throw new Error(`Failed to update user credits: ${updateError.message}`);
        }
      }

      toast({
        title: "Credits Updated",
        description: `Successfully ${transactionType === 'admin_adjustment' ? 'adjusted' : transactionType}d ${amount} credits.`,
      });

      return true;
    } catch (error: any) {
      console.error('Credit transaction error:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to update credits.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processTransaction,
    isLoading
  };
};
