
-- Check for the newly registered user
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  p.provider,
  s.status as subscription_status,
  uc.current_balance as credit_balance,
  uo.has_seen_welcome_prompt
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
LEFT JOIN public.user_credits uc ON p.id = uc.user_id  
LEFT JOIN public.user_onboarding uo ON p.id = uo.user_id
WHERE p.email = 'mbrown@triumphpay.com'
ORDER BY p.created_at DESC;

-- Also check if there are any recent users created in the last hour
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  p.provider,
  s.status as subscription_status,
  uc.current_balance as credit_balance
FROM public.profiles p
LEFT JOIN public.subscriptions s ON p.id = s.user_id
LEFT JOIN public.user_credits uc ON p.id = uc.user_id
WHERE p.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY p.created_at DESC;
