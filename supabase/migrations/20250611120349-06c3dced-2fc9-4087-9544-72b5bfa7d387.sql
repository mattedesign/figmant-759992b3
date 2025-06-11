
-- First, drop the old constraint that requires at least one price
ALTER TABLE public.subscription_plans DROP CONSTRAINT at_least_one_price;

-- Update subscription_plans table to support flexible pricing model
ALTER TABLE public.subscription_plans 
ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'recurring' CHECK (plan_type IN ('recurring', 'credits'));

-- For credit-based plans, credits represent the number of credits purchased
-- For recurring plans, credits represent the monthly/annual allowance
ALTER TABLE public.subscription_plans 
ADD COLUMN credit_price DECIMAL(10,2);

-- Add new flexible pricing constraint
ALTER TABLE public.subscription_plans 
ADD CONSTRAINT valid_plan_pricing CHECK (
  (plan_type = 'recurring' AND (price_monthly IS NOT NULL OR price_annual IS NOT NULL)) OR
  (plan_type = 'credits' AND credit_price IS NOT NULL)
);

-- Create user_credits table to track credit balance and transactions
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_balance INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create credit_transactions table to track all credit movements
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'admin_adjustment')),
  amount INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference design_uploads, subscription_plans, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on new tables
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "users_can_view_own_credits" ON public.user_credits
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "owners_can_manage_all_credits" ON public.user_credits
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

-- RLS policies for credit_transactions
CREATE POLICY "users_can_view_own_transactions" ON public.credit_transactions
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "owners_can_manage_all_transactions" ON public.credit_transactions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

-- Add trigger for updated_at on user_credits
CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample credit-based plans
INSERT INTO public.subscription_plans (name, description, plan_type, credits, credit_price, is_active)
VALUES 
  ('100 Credits Pack', 'Perfect for testing and small projects', 'credits', 100, 29.99, true),
  ('500 Credits Pack', 'Great for regular usage', 'credits', 500, 99.99, true),
  ('1000 Credits Pack', 'Best value for power users', 'credits', 1000, 179.99, true);
