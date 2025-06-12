
-- First, let's check if the trigger already exists and drop it if it does
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function to ensure it's up to date
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
  
  -- Insert into subscriptions table with 'inactive' status by default
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'inactive'::subscription_status);
  
  -- Insert into user_credits table with 0 balance
  INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger that executes after a new user is inserted in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
  'inactive'::subscription_status
FROM auth.users au
LEFT JOIN public.subscriptions s ON au.id = s.user_id
WHERE s.user_id IS NULL;

-- Backfill missing user_credits for existing users who don't have them
INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
SELECT 
  au.id,
  0,
  0,
  0
FROM auth.users au
LEFT JOIN public.user_credits uc ON au.id = uc.user_id
WHERE uc.user_id IS NULL;
