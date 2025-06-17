
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [TEST-STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Test function started", { method: req.method, url: req.url });

  try {
    const body = await req.json();
    const { testType, userEmail, creditAmount } = body;

    logStep("Test request received", { testType, userEmail, creditAmount });

    // Validate Stripe configuration
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      logStep("ERROR: Missing Stripe secret key");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "STRIPE_SECRET_KEY not configured" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!webhookSecret) {
      logStep("WARNING: Missing webhook secret - webhooks may not work properly");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (testType === 'create_test_checkout') {
      // Test creating a checkout session
      logStep("Creating test checkout session");
      
      const session = await stripe.checkout.sessions.create({
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${creditAmount} Credits - Test Purchase`,
                description: `Test purchase of ${creditAmount} analysis credits`,
              },
              unit_amount: Math.round((creditAmount * 0.1) * 100), // $0.10 per credit in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/subscription?canceled=true`,
        metadata: {
          user_id: 'test-user-id',
          credit_amount: creditAmount.toString(),
          test_mode: 'true'
        }
      });

      logStep("Test checkout session created", { sessionId: session.id, url: session.url });

      return new Response(JSON.stringify({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
        message: "Test checkout session created successfully"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (testType === 'simulate_webhook') {
      // Simulate a successful webhook payload
      logStep("Simulating webhook payload processing");

      // Check if user exists by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();

      if (profileError) {
        logStep("ERROR: Failed to find user profile", { error: profileError });
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to find user profile"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (!profile) {
        logStep("ERROR: No user found with email", { email: userEmail });
        return new Response(JSON.stringify({
          success: false,
          error: `No user found with email: ${userEmail}`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const userId = profile.id;
      logStep("Found user profile", { userId, email: userEmail });

      // Get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        logStep("ERROR: Failed to fetch current credits", { error: fetchError });
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to fetch current credits"
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const newBalance = (currentCredits?.current_balance || 0) + creditAmount;
      const newTotalPurchased = (currentCredits?.total_purchased || 0) + creditAmount;

      logStep("Calculated new credit values", { 
        currentBalance: currentCredits?.current_balance || 0,
        newBalance,
        newTotalPurchased 
      });

      // Update credits using upsert with conflict resolution
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
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to update credits"
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'purchase',
          amount: creditAmount,
          description: `Test credit purchase simulation - ${creditAmount} credits`,
          reference_id: `test-${Date.now()}`,
          created_by: userId
        });

      if (transactionError) {
        logStep("ERROR: Failed to create transaction record", { error: transactionError });
      }

      logStep("Test simulation completed successfully", { 
        userId, 
        newBalance, 
        creditsAdded: creditAmount 
      });

      return new Response(JSON.stringify({
        success: true,
        userId,
        creditsAdded: creditAmount,
        newBalance,
        message: "Webhook simulation completed successfully"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (testType === 'validate_config') {
      // Validate configuration
      logStep("Validating Stripe and Supabase configuration");

      const config = {
        stripe_key_configured: !!stripeKey,
        webhook_secret_configured: !!webhookSecret,
        supabase_url_configured: !!Deno.env.get("SUPABASE_URL"),
        supabase_service_key_configured: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      };

      // Test Stripe connection
      let stripeConnection = false;
      try {
        await stripe.customers.list({ limit: 1 });
        stripeConnection = true;
        logStep("Stripe connection successful");
      } catch (error) {
        logStep("ERROR: Stripe connection failed", { error: error.message });
      }

      // Test Supabase connection
      let supabaseConnection = false;
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        supabaseConnection = !error;
        logStep("Supabase connection successful");
      } catch (error) {
        logStep("ERROR: Supabase connection failed", { error: error.message });
      }

      return new Response(JSON.stringify({
        success: true,
        configuration: config,
        connections: {
          stripe: stripeConnection,
          supabase: supabaseConnection
        },
        webhook_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/stripe-webhook`,
        message: "Configuration validation completed"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Invalid test type specified"
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    logStep("ERROR: Test function failed", { 
      error: error.message,
      stack: error.stack 
    });
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
