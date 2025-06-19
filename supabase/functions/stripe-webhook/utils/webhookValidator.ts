
import Stripe from "https://esm.sh/stripe@14.21.0";
import { logStep } from "./logging.ts";

export const validateAndConstructEvent = async (
  req: Request,
  stripe: Stripe,
  endpointSecret: string
): Promise<Stripe.Event | null> => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    logStep("ERROR: Missing stripe signature");
    return null;
  }

  if (!endpointSecret) {
    logStep("ERROR: Missing webhook secret");
    return null;
  }

  try {
    const body = await req.text();
    logStep("Constructing webhook event", { signatureExists: !!signature, bodyLength: body.length });
    
    // Use the async version of constructEvent
    const event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
    
    logStep(`Webhook event received: ${event.type}`, { eventId: event.id });
    return event;
    
  } catch (error) {
    logStep("ERROR: Webhook validation failed", { 
      error: error.message,
      stack: error.stack 
    });
    return null;
  }
};
