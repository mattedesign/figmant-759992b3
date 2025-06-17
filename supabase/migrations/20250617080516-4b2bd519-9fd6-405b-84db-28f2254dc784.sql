
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
