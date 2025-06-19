
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "./logging.ts";
import { findUserByEmailOrId } from "./userLookup.ts";
import { processCreditsTransaction } from "./creditOperations.ts";

export const processCheckoutSession = async (
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  logStep("Processing checkout session", { 
    sessionId: session.id, 
    mode: session.mode,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_email,
    metadata: session.metadata
  });
  
  // Only process payment mode sessions (one-time payments for credits)
  if (session.mode !== "payment") {
    logStep("Skipping non-payment session", { mode: session.mode });
    return {
      success: true,
      message: "non-payment mode",
      statusCode: 200
    };
  }

  // Get metadata from the session
  const userId = session.metadata?.user_id;
  const creditAmount = parseInt(session.metadata?.credit_amount || "0");
  const customerEmail = session.customer_email;
  
  logStep("Session metadata extracted", { userId, creditAmount, customerEmail });

  if (!creditAmount || creditAmount <= 0) {
    logStep("ERROR: Invalid or missing credit amount", { creditAmount });
    return {
      success: false,
      message: "Invalid credit amount",
      statusCode: 400
    };
  }

  // Create Supabase client with service role key
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const targetUserId = await findUserByEmailOrId(supabase, userId, customerEmail);
  
  if (!targetUserId) {
    return {
      success: false,
      message: "No user found to credit",
      statusCode: 400
    };
  }

  try {
    await processCreditsTransaction(supabase, targetUserId, creditAmount, session.id);
    return {
      success: true,
      message: "Credits processed successfully",
      statusCode: 200
    };
  } catch (error) {
    return {
      success: false,
      message: "Error processing purchase",
      statusCode: 500
    };
  }
};
