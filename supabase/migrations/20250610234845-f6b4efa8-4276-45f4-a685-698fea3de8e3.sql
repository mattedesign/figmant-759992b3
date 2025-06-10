
-- First, let's update the handle_new_user function to create users with 'free' status by default
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
  
  -- Insert into subscriptions table with 'free' status by default
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'free'::subscription_status);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Backfill missing profiles for existing users who don't have them
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', ''),
  'subscriber'::user_role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Backfill missing subscriptions for existing users who don't have them
INSERT INTO public.subscriptions (user_id, status)
SELECT 
  au.id,
  'free'::subscription_status
FROM auth.users au
LEFT JOIN public.subscriptions s ON au.id = s.user_id
WHERE s.user_id IS NULL;

-- Update any existing 'inactive' subscriptions to 'free' to give users access
UPDATE public.subscriptions 
SET status = 'free'::subscription_status 
WHERE status = 'inactive'::subscription_status;
