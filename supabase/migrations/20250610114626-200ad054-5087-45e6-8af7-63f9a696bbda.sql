
-- First, let's drop the existing trigger if it exists and recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'subscriber'::user_role
  );
  
  -- Insert into subscriptions table
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'inactive'::subscription_status);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Handle any existing users that might not have profiles/subscriptions
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', ''),
  'subscriber'::user_role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

INSERT INTO public.subscriptions (user_id, status)
SELECT 
  au.id,
  'inactive'::subscription_status
FROM auth.users au
LEFT JOIN public.subscriptions s ON au.id = s.user_id
WHERE s.user_id IS NULL;
