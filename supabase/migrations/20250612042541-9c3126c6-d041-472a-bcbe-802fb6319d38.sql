
-- Step 1: Clean up orphaned subscription records (users that don't exist in auth.users)
DELETE FROM public.subscriptions 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

-- Step 2: Create user_credits records for users who don't have them yet (only for existing users)
INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
SELECT 
  s.user_id,
  0 as current_balance,
  0 as total_purchased, 
  0 as total_used
FROM public.subscriptions s
LEFT JOIN public.user_credits uc ON s.user_id = uc.user_id
WHERE uc.user_id IS NULL
AND s.user_id IN (SELECT id FROM auth.users);

-- Step 3: Update all 'free' subscription users to 'inactive'
UPDATE public.subscriptions 
SET status = 'inactive'::subscription_status 
WHERE status = 'free'::subscription_status;

-- Step 4: Update the handle_new_user function to create users with 'inactive' subscriptions and 0 credit balance
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

-- Step 5: Update the user_has_access function to remove 'free' status check
CREATE OR REPLACE FUNCTION public.user_has_access(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $$
DECLARE
  has_active_subscription boolean := false;
  has_credits boolean := false;
  user_role text;
BEGIN
  -- Check if user is owner
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  IF user_role = 'owner' THEN
    RETURN true;
  END IF;
  
  -- Check for active subscription (removed 'free' from the list)
  SELECT EXISTS(
    SELECT 1 
    FROM public.subscriptions 
    WHERE subscriptions.user_id = user_has_access.user_id 
    AND status = 'active'
  ) INTO has_active_subscription;
  
  -- Check for available credits
  SELECT EXISTS(
    SELECT 1 
    FROM public.user_credits 
    WHERE user_credits.user_id = user_has_access.user_id 
    AND current_balance > 0
  ) INTO has_credits;
  
  RETURN has_active_subscription OR has_credits;
END;
$$;

-- Step 6: Update the deduct_analysis_credits function to remove 'free' status check
CREATE OR REPLACE FUNCTION public.deduct_analysis_credits(analysis_user_id uuid, credits_to_deduct integer DEFAULT 1, analysis_description text DEFAULT 'Design analysis'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  current_balance integer := 0;
  has_active_subscription boolean := false;
  user_role text;
BEGIN
  -- Check if user is owner (unlimited access)
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = analysis_user_id;
  
  IF user_role = 'owner' THEN
    RETURN true;
  END IF;
  
  -- Check for active subscription (unlimited access) - removed 'free' from check
  SELECT EXISTS(
    SELECT 1 
    FROM public.subscriptions 
    WHERE user_id = analysis_user_id 
    AND status = 'active'
  ) INTO has_active_subscription;
  
  IF has_active_subscription THEN
    RETURN true;
  END IF;
  
  -- Check current credit balance
  SELECT COALESCE(user_credits.current_balance, 0) INTO current_balance
  FROM public.user_credits
  WHERE user_id = analysis_user_id;
  
  -- If insufficient credits, return false
  IF current_balance < credits_to_deduct THEN
    RETURN false;
  END IF;
  
  -- Deduct credits and create transaction
  UPDATE public.user_credits
  SET 
    current_balance = current_balance - credits_to_deduct,
    total_used = total_used + credits_to_deduct,
    updated_at = now()
  WHERE user_id = analysis_user_id;
  
  -- Create transaction record
  INSERT INTO public.credit_transactions (
    user_id,
    transaction_type,
    amount,
    description,
    created_by
  ) VALUES (
    analysis_user_id,
    'usage',
    credits_to_deduct,
    analysis_description,
    analysis_user_id
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- If any error occurs, return false
    RETURN false;
END;
$$;
