
-- First, let's check if the user exists in auth.users (we can see this through profiles)
SELECT COUNT(*) as profile_count FROM public.profiles WHERE email = 'angie@angiebrown.design';

-- Let's also check what profiles do exist to see if there's a similar email
SELECT email, full_name, role, created_at 
FROM public.profiles 
WHERE email ILIKE '%angie%' OR email ILIKE '%brown%' OR full_name ILIKE '%angie%'
ORDER BY created_at DESC;

-- Check if there are any credit records without matching profiles
SELECT uc.user_id, uc.current_balance, uc.total_purchased, uc.total_used
FROM public.user_credits uc
LEFT JOIN public.profiles p ON uc.user_id = p.id
WHERE p.id IS NULL;

-- Check for any orphaned credit transactions
SELECT ct.user_id, ct.transaction_type, ct.amount, ct.description, ct.created_at
FROM public.credit_transactions ct
LEFT JOIN public.profiles p ON ct.user_id = p.id
WHERE p.id IS NULL
ORDER BY ct.created_at DESC;

-- Let's see all users and their credit status
SELECT 
  p.email,
  p.full_name,
  p.role,
  COALESCE(uc.current_balance, 0) as current_balance,
  COALESCE(uc.total_purchased, 0) as total_purchased,
  COALESCE(uc.total_used, 0) as total_used
FROM public.profiles p
LEFT JOIN public.user_credits uc ON p.id = uc.user_id
ORDER BY p.created_at DESC
LIMIT 10;
