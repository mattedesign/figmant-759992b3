
-- Fix the create_user_manual function to properly reference enum types
CREATE OR REPLACE FUNCTION public.create_user_manual(
  p_email TEXT,
  p_full_name TEXT,
  p_role public.user_role DEFAULT 'subscriber'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_user_id UUID;
  result jsonb;
BEGIN
  -- Check if the calling user is an owner
  IF NOT public.has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Only owners can create users manually';
  END IF;

  -- Check if user with this email already exists
  SELECT id INTO new_user_id
  FROM public.profiles
  WHERE email = p_email;

  IF new_user_id IS NOT NULL THEN
    RAISE EXCEPTION 'User with email % already exists', p_email;
  END IF;

  -- Generate a new user ID
  new_user_id := gen_random_uuid();

  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new_user_id, p_email, p_full_name, p_role);

  -- Insert into subscriptions table with appropriate status
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (
    new_user_id, 
    CASE 
      WHEN p_role = 'owner' THEN 'active'::public.subscription_status
      ELSE 'inactive'::public.subscription_status
    END
  );

  -- Return the created user data
  SELECT jsonb_build_object(
    'id', new_user_id,
    'email', p_email,
    'full_name', p_full_name,
    'role', p_role,
    'created_at', now()
  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
END;
$$;
