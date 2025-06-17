
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [PROCESS-STRIPE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Function started", { method: req.method, url: req.url });

  try {
    const body = await req.json();
    logStep("Request body received", { body });

    // Extract payment data from Make.com
    const {
      user_email,
      user_id,
      credit_amount,
      stripe_session_id,
      amount_paid,
      currency = 'usd'
    } = body;

    // Validate required fields
    if (!credit_amount || credit_amount <= 0) {
      logStep("ERROR: Invalid credit amount", { credit_amount });
      return new Response(JSON.stringify({ error: "Invalid credit amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!user_email && !user_id) {
      logStep("ERROR: No user identifier provided");
      return new Response(JSON.stringify({ error: "User email or ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let targetUserId = user_id;

    // If no userId provided, try to find user by email
    if (!targetUserId && user_email) {
      logStep("Looking up user by email", { email: user_email });
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user_email)
        .single();

      if (profile && !profileError) {
        targetUserId = profile.id;
        logStep("Found user by email", { userId: targetUserId });
      } else {
        logStep("User not found by email", { email: user_email, error: profileError });
      }
    }

    if (!targetUserId) {
      logStep("ERROR: No user ID found - cannot credit account", { 
        user_email, 
        user_id 
      });
      return new Response(JSON.stringify({ error: "No user found to credit" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Process credit transaction
    try {
      logStep("Processing credit transaction", { userId: targetUserId, creditAmount: credit_amount });

      // First, get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        logStep("ERROR: Failed to fetch current credits", { error: fetchError });
        throw fetchError;
      }

      const newBalance = (currentCredits?.current_balance || 0) + credit_amount;
      const newTotalPurchased = (currentCredits?.total_purchased || 0) + credit_amount;

      logStep("Calculated new credit values", { 
        currentBalance: currentCredits?.current_balance || 0,
        newBalance,
        newTotalPurchased 
      });

      // Update or insert credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: targetUserId,
          current_balance: newBalance,
          total_purchased: newTotalPurchased,
          total_used: currentCredits?.total_used || 0,
          updated_at: new Date().toISOString()
        });

      if (creditsError) {
        logStep("ERROR: Failed to update credits", { error: creditsError });
        throw creditsError;
      }

      logStep("Credits updated successfully", { newBalance, newTotalPurchased });

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: targetUserId,
          transaction_type: 'purchase',
          amount: credit_amount,
          description: `Purchased ${credit_amount} credits via Stripe (Processed by Make.com) - Session: ${stripe_session_id || 'N/A'}`,
          reference_id: stripe_session_id,
          created_by: targetUserId
        });

      if (transactionError) {
        logStep("ERROR: Failed to create transaction record", { error: transactionError });
        // Don't throw here - credits were already added
      } else {
        logStep("Transaction record created successfully");
      }

      logStep(`SUCCESS: Added ${credit_amount} credits to user ${targetUserId}`, {
        stripeSessionId: stripe_session_id,
        finalBalance: newBalance,
        amountPaid: amount_paid,
        currency
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: `Successfully added ${credit_amount} credits`,
        user_id: targetUserId,
        new_balance: newBalance
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
      
    } catch (error) {
      logStep("ERROR: Failed to process credit purchase", { 
        error: error.message,
        stripeSessionId: stripe_session_id,
        userId: targetUserId 
      });
      return new Response(JSON.stringify({ 
        error: "Error processing purchase",
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
  } catch (error) {
    logStep("ERROR: Function processing failed", { 
      error: error.message,
      stack: error.stack 
    });
    return new Response(JSON.stringify({ 
      error: "Function error",
      details: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
