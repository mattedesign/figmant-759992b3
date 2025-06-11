
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  price_monthly DECIMAL(10,2),
  price_annual DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  CONSTRAINT valid_credits CHECK (credits >= 0),
  CONSTRAINT valid_monthly_price CHECK (price_monthly IS NULL OR price_monthly >= 0),
  CONSTRAINT valid_annual_price CHECK (price_annual IS NULL OR price_annual >= 0),
  CONSTRAINT at_least_one_price CHECK (price_monthly IS NOT NULL OR price_annual IS NOT NULL)
);

-- Enable RLS on subscription plans table
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for owners to manage subscription plans
CREATE POLICY "owners_can_manage_subscription_plans" ON public.subscription_plans
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

-- Create policy for all users to view active subscription plans
CREATE POLICY "users_can_view_active_subscription_plans" ON public.subscription_plans
FOR SELECT
USING (is_active = true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
