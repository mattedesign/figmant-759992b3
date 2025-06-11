
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
}

export interface CreateSubscriptionPlanData {
  name: string;
  description?: string;
  credits: number;
  price_monthly?: number;
  price_annual?: number;
  is_active?: boolean;
}

export interface UpdateSubscriptionPlanData extends Partial<CreateSubscriptionPlanData> {
  id: string;
}
