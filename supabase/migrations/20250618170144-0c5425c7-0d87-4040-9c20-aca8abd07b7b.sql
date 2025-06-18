
-- Check for users with the specific email addresses
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  provider
FROM public.profiles 
WHERE email IN ('say1534@gmail.com', 'stephyoungdesign@gmail.com')
ORDER BY created_at DESC;

-- Also check for any partial matches in case there are variations
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  provider
FROM public.profiles 
WHERE LOWER(email) LIKE '%say1534%' 
  OR LOWER(email) LIKE '%stephyoungdesign%'
ORDER BY created_at DESC;
