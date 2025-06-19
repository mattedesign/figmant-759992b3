
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "./utils/logging.ts";
import { validatePaymentRequest } from "./utils/requestValidation.ts";
import { findUserByEmailOrId } from "./utils/userLookup.ts";
import { processCreditsTransaction } from "./utils/creditOperations.ts";
import { corsHeaders, createSuccessResponse, createErrorResponse, createCorsResponse } from "./utils/responseHelpers.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createCorsResponse();
  }

  logStep("Function started", { method: req.method, url: req.url });

  try {
    const body = await req.json();
    const paymentData = validatePaymentRequest(body);

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const targetUserId = await findUserByEmailOrId(
      supabase, 
      paymentData.user_id, 
      paymentData.user_email
    );

    if (!targetUserId) {
      return createErrorResponse("No user found to credit", 400);
    }

    await processCreditsTransaction(
      supabase, 
      targetUserId, 
      paymentData.credit_amount, 
      paymentData.stripe_session_id
    );

    // Get final balance for response
    const { data: finalCredits } = await supabase
      .from('user_credits')
      .select('current_balance')
      .eq('user_id', targetUserId)
      .single();

    logStep(`SUCCESS: Added ${paymentData.credit_amount} credits to user ${targetUserId}`, {
      stripeSessionId: paymentData.stripe_session_id,
      finalBalance: finalCredits?.current_balance,
      amountPaid: paymentData.amount_paid,
      currency: paymentData.currency
    });

    return createSuccessResponse(
      `Successfully added ${paymentData.credit_amount} credits`,
      {
        user_id: targetUserId,
        new_balance: finalCredits?.current_balance
      }
    );
    
  } catch (error) {
    logStep("ERROR: Function processing failed", { 
      error: error.message,
      stack: error.stack 
    });
    return createErrorResponse("Function error", 400, error.message);
  }
});
