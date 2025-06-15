
-- Remove all recurring subscription plans (keep only credit-based plans)
DELETE FROM public.subscription_plans 
WHERE plan_type = 'recurring';

-- Update any existing subscribers to have inactive subscriptions since we're removing recurring plans
UPDATE public.subscriptions 
SET status = 'inactive', updated_at = now() 
WHERE status = 'active';

-- Add a comment to document the change
COMMENT ON TABLE public.subscription_plans IS 'Credit-based plans only. Recurring subscriptions have been deprecated.';
