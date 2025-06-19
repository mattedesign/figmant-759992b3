
import { logStep } from "./logging.ts";

export const processCreditsTransaction = async (
  supabase: any,
  userId: string,
  creditAmount: number,
  sessionId: string
): Promise<boolean> => {
  try {
    logStep("Processing credit transaction", { userId, creditAmount });

    // First, get current credits
    const { data: currentCredits, error: fetchError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logStep("ERROR: Failed to fetch current credits", { error: fetchError });
      throw fetchError;
    }

    const newBalance = (currentCredits?.current_balance || 0) + creditAmount;
    const newTotalPurchased = (currentCredits?.total_purchased || 0) + creditAmount;

    logStep("Calculated new credit values", { 
      currentBalance: currentCredits?.current_balance || 0,
      newBalance,
      newTotalPurchased 
    });

    // Update or insert credits using upsert with conflict resolution
    const { error: creditsError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        current_balance: newBalance,
        total_purchased: newTotalPurchased,
        total_used: currentCredits?.total_used || 0,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (creditsError) {
      logStep("ERROR: Failed to update credits", { error: creditsError });
      throw creditsError;
    }

    logStep("Credits updated successfully", { newBalance, newTotalPurchased });

    // Create transaction record with proper UUID for reference_id
    // Generate a UUID for the reference_id field and include Stripe session ID in description
    const transactionReferenceId = crypto.randomUUID();
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        transaction_type: 'purchase',
        amount: creditAmount,
        description: `Purchased ${creditAmount} credits via Stripe (Session: ${sessionId})`,
        reference_id: transactionReferenceId,
        created_by: userId
      });

    if (transactionError) {
      logStep("ERROR: Failed to create transaction record", { error: transactionError });
      // Don't throw here - credits were already added
    } else {
      logStep("Transaction record created successfully", { 
        referenceId: transactionReferenceId,
        stripeSessionId: sessionId
      });
    }

    logStep(`SUCCESS: Added ${creditAmount} credits to user ${userId}`, {
      sessionId,
      finalBalance: newBalance,
      transactionReferenceId
    });

    return true;
    
  } catch (error) {
    logStep("ERROR: Failed to process credit purchase", { 
      error: error.message,
      sessionId,
      userId 
    });
    throw error;
  }
};
