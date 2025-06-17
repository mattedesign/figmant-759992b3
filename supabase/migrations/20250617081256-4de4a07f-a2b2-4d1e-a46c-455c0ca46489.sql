
-- First, let's get the user ID from auth.users for angie@angiebrown.design
-- We'll use this to create the missing profile and credit records

-- Create the missing profile record for the user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', 'Angie Brown'),
  'subscriber'::user_role
FROM auth.users au
WHERE au.email = 'angie@angiebrown.design'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
  );

-- Create the missing subscription record
INSERT INTO public.subscriptions (user_id, status)
SELECT 
  au.id,
  'inactive'::subscription_status
FROM auth.users au
WHERE au.email = 'angie@angiebrown.design'
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s WHERE s.user_id = au.id
  );

-- Create the missing user_credits record with 5 welcome credits
INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
SELECT 
  au.id,
  5,
  5,
  0
FROM auth.users au
WHERE au.email = 'angie@angiebrown.design'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_credits uc WHERE uc.user_id = au.id
  );

-- Create the welcome bonus transaction record
INSERT INTO public.credit_transactions (
  user_id,
  transaction_type,
  amount,
  description,
  created_by
)
SELECT 
  au.id,
  'purchase',
  5,
  'Welcome bonus - 5 free credits (manual fix)',
  au.id
FROM auth.users au
WHERE au.email = 'angie@angiebrown.design'
  AND NOT EXISTS (
    SELECT 1 FROM public.credit_transactions ct WHERE ct.user_id = au.id
  );

-- Create the onboarding record
INSERT INTO public.user_onboarding (user_id)
SELECT 
  au.id
FROM auth.users au
WHERE au.email = 'angie@angiebrown.design'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_onboarding uo WHERE uo.user_id = au.id
  );

-- Verify the fix by checking the user's complete record
SELECT 
  p.email,
  p.full_name,
  p.role,
  s.status as subscription_status,
  uc.current_balance,
  uc.total_purchased,
  uc.total_used,
  COUNT(ct.id) as transaction_count
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
LEFT JOIN public.user_credits uc ON p.id = uc.user_id
LEFT JOIN public.credit_transactions ct ON p.id = ct.user_id
WHERE p.email = 'angie@angiebrown.design'
GROUP BY p.email, p.full_name, p.role, s.status, uc.current_balance, uc.total_purchased, uc.total_used;
