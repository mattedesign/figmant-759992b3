
-- Check the user profile and credits for angie@angiebrown.design
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.role,
  uc.current_balance,
  uc.total_purchased,
  uc.total_used,
  uc.created_at as credits_created,
  uc.updated_at as credits_updated
FROM public.profiles p
LEFT JOIN public.user_credits uc ON p.id = uc.user_id
WHERE p.email = 'angie@angiebrown.design';

-- Check credit transactions for this user
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

-- Check if there are any subscription records
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
