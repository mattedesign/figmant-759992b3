
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

// Helper logging function
const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  logStep("Webhook request received", { method: req.method, url: req.url });

  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    logStep("ERROR: Missing stripe signature");
    return new Response("Missing stripe signature", { status: 400 });
  }

  if (!endpointSecret) {
    logStep("ERROR: Missing webhook secret");
    return new Response("Missing webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    logStep("Constructing webhook event", { signatureExists: !!signature, bodyLength: body.length });
    
    // Use the async version of constructEvent
    const event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
    
    logStep(`Webhook event received: ${event.type}`, { eventId: event.id });

    // Handle successful checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
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
        return new Response(JSON.stringify({ received: true, skipped: "non-payment mode" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Get metadata from the session
      const userId = session.metadata?.user_id;
      const creditAmount = parseInt(session.metadata?.credit_amount || "0");
      const customerEmail = session.customer_email;
      
      logStep("Session metadata extracted", { userId, creditAmount, customerEmail });

      if (!creditAmount || creditAmount <= 0) {
        logStep("ERROR: Invalid or missing credit amount", { creditAmount });
        return new Response("Invalid credit amount", { status: 400 });
      }

      // Create Supabase client with service role key
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      let targetUserId = userId;

      // If no userId in metadata, try to find user by email
      if (!targetUserId && customerEmail) {
        logStep("Looking up user by email", { email: customerEmail });
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single();

        if (profile && !profileError) {
          targetUserId = profile.id;
          logStep("Found user by email", { userId: targetUserId });
        } else {
          logStep("User not found by email", { email: customerEmail, error: profileError });
        }
      }

      if (!targetUserId) {
        logStep("ERROR: No user ID found - cannot credit account", { 
          sessionId: session.id, 
          customerEmail 
        });
        return new Response("No user found to credit", { status: 400 });
      }

      // Add credits to user's account
      try {
        logStep("Processing credit transaction", { userId: targetUserId, creditAmount });

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
            user_id: targetUserId,
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
            user_id: targetUserId,
            transaction_type: 'purchase',
            amount: creditAmount,
            description: `Purchased ${creditAmount} credits via Stripe (Session: ${session.id})`,
            reference_id: transactionReferenceId,
            created_by: targetUserId
          });

        if (transactionError) {
          logStep("ERROR: Failed to create transaction record", { error: transactionError });
          // Don't throw here - credits were already added
        } else {
          logStep("Transaction record created successfully", { 
            referenceId: transactionReferenceId,
            stripeSessionId: session.id
          });
        }

        logStep(`SUCCESS: Added ${creditAmount} credits to user ${targetUserId}`, {
          sessionId: session.id,
          finalBalance: newBalance,
          transactionReferenceId
        });
        
      } catch (error) {
        logStep("ERROR: Failed to process credit purchase", { 
          error: error.message,
          sessionId: session.id,
          userId: targetUserId 
        });
        return new Response("Error processing purchase", { status: 500 });
      }
    } else {
      logStep("Unhandled webhook event type", { eventType: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    logStep("ERROR: Webhook processing failed", { 
      error: error.message,
      stack: error.stack 
    });
    return new Response("Webhook error", { status: 400 });
  }
});
