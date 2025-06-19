
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { logStep } from "./utils/logging.ts";
import { validateAndConstructEvent } from "./utils/webhookValidator.ts";
import { processCheckoutSession } from "./utils/sessionProcessor.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  logStep("Webhook request received", { method: req.method, url: req.url });

  const event = await validateAndConstructEvent(req, stripe, endpointSecret!);
  
  if (!event) {
    return new Response("Webhook error", { status: 400 });
  }

  // Handle successful checkout completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const result = await processCheckoutSession(session);
    
    if (!result.success) {
      return new Response(result.message, { status: result.statusCode });
    }

    return new Response(JSON.stringify({ received: true, message: result.message }), {
      headers: { "Content-Type": "application/json" },
      status: result.statusCode,
    });
  } else {
    logStep("Unhandled webhook event type", { eventType: event.type });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
