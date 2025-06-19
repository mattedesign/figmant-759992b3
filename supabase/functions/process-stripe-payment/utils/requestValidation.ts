
import { logStep } from "./logging.ts";

export interface PaymentRequestData {
  user_email?: string;
  user_id?: string;
  credit_amount: number;
  stripe_session_id?: string;
  amount_paid?: number;
  currency?: string;
}

export const validatePaymentRequest = (body: any): PaymentRequestData => {
  logStep("Request body received", { body });

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
    throw new Error("Invalid credit amount");
  }

  if (!user_email && !user_id) {
    logStep("ERROR: No user identifier provided");
    throw new Error("User email or ID required");
  }

  return {
    user_email,
    user_id,
    credit_amount,
    stripe_session_id,
    amount_paid,
    currency
  };
};
