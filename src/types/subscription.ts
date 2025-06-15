
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price_monthly: number | null;
  price_annual: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  plan_type: 'credits'; // Only credit-based plans supported
  credit_price: number | null;
}

export interface CreateSubscriptionPlanData {
  name: string;
  description?: string;
  credits: number;
  price_monthly?: undefined; // Not used for credit packs
  price_annual?: undefined; // Not used for credit packs
  is_active?: boolean;
  plan_type: 'credits'; // Only credit-based plans
  credit_price?: number;
}

export interface UpdateSubscriptionPlanData extends Partial<CreateSubscriptionPlanData> {
  id: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  current_balance: number;
  total_purchased: number;
  total_used: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'admin_adjustment';
  amount: number;
  description: string | null;
  reference_id: string | null;
  created_at: string;
  created_by: string | null;
}

export interface CreateCreditTransactionData {
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'admin_adjustment';
  amount: number;
  description?: string;
  reference_id?: string;
}
