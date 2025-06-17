
-- Find the user ID for angie@angiebrown.design
SELECT id as user_id, email, full_name, created_at
FROM public.profiles 
WHERE email = 'angie@angiebrown.design';

-- Check for any credit transactions that might be from Stripe
SELECT 
  ct.id,
  ct.transaction_type,
  ct.amount,
  ct.description,
  ct.reference_id,
  ct.created_at,
  ct.created_by
FROM public.profiles p
JOIN public.credit_transactions ct ON p.id = ct.user_id
WHERE p.email = 'angie@angiebrown.design'
ORDER BY ct.created_at DESC;

-- Check for any subscription records with Stripe customer ID
SELECT 
  s.id,
  s.status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.current_period_start,
  s.current_period_end,
  s.created_at
FROM public.profiles p
JOIN public.subscriptions s ON p.id = s.user_id
WHERE p.email = 'angie@angiebrown.design';

-- Check the subscribers table for any Stripe customer information
SELECT 
  sub.id,
  sub.email,
  sub.stripe_customer_id,
  sub.subscribed,
  sub.subscription_tier,
  sub.subscription_end,
  sub.created_at,
  sub.updated_at
FROM public.subscribers sub
WHERE sub.email = 'angie@angiebrown.design';
