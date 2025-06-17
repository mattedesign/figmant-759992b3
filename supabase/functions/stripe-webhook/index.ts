
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature || !endpointSecret) {
    return new Response("Missing stripe signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    
    console.log(`Webhook received: ${event.type}`);

    // Handle successful checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Processing checkout session:", session.id);
      
      // Get metadata from the session
      const userId = session.metadata?.user_id;
      const creditAmount = parseInt(session.metadata?.credit_amount || "0");
      
      if (!userId || !creditAmount) {
        console.error("Missing required metadata:", { userId, creditAmount });
        return new Response("Missing metadata", { status: 400 });
      }

      // Create Supabase client with service role key
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Add credits to user's account
      try {
        // First, get current credits
        const { data: currentCredits } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', userId)
          .single();

        const newBalance = (currentCredits?.current_balance || 0) + creditAmount;
        const newTotalPurchased = (currentCredits?.total_purchased || 0) + creditAmount;

        // Update or insert credits
        const { error: creditsError } = await supabase
          .from('user_credits')
          .upsert({
            user_id: userId,
            current_balance: newBalance,
            total_purchased: newTotalPurchased,
            total_used: currentCredits?.total_used || 0
          });

        if (creditsError) {
          console.error("Error updating credits:", creditsError);
          return new Response("Error updating credits", { status: 500 });
        }

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: userId,
            transaction_type: 'purchase',
            amount: creditAmount,
            description: `Purchased ${creditAmount} credits via Stripe`,
            reference_id: session.id,
            created_by: userId
          });

        if (transactionError) {
          console.error("Error creating transaction:", transactionError);
        }

        console.log(`Successfully added ${creditAmount} credits to user ${userId}`);
        
      } catch (error) {
        console.error("Error processing credit purchase:", error);
        return new Response("Error processing purchase", { status: 500 });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 400 });
  }
});
