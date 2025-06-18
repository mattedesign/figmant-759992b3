
-- Check for users with the name "stephanie young" (case-insensitive search)
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  provider
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%stephanie%' 
  AND LOWER(full_name) LIKE '%young%'
ORDER BY created_at DESC;

-- Also check for partial matches in case the name is stored differently
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  provider
FROM public.profiles 
WHERE LOWER(full_name) LIKE '%stephanie%' 
  OR LOWER(full_name) LIKE '%young%'
  OR LOWER(email) LIKE '%stephanie%'
  OR LOWER(email) LIKE '%young%'
ORDER BY created_at DESC;
