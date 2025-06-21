
-- Refresh user credits record
UPDATE public.user_credits 
SET current_balance = 90, updated_at = now()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'mbrown@tfin.com');

-- Verify user profile exists
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, '', 'subscriber'
FROM auth.users 
WHERE email = 'mbrown@tfin.com'
ON CONFLICT (id) DO NOTHING;
