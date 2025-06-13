
-- Update the handle_new_user function to grant 5 free credits on signup
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
  
  -- Insert into user_credits table with 5 free credits
  INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
  VALUES (NEW.id, 5, 5, 0);
  
  -- Create a transaction record for the free credits
  INSERT INTO public.credit_transactions (
    user_id,
    transaction_type,
    amount,
    description,
    created_by
  ) VALUES (
    NEW.id,
    'purchase',
    5,
    'Welcome bonus - 5 free credits',
    NEW.id
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create a table to track user onboarding flow
CREATE TABLE IF NOT EXISTS public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  has_seen_welcome_prompt BOOLEAN NOT NULL DEFAULT FALSE,
  has_seen_credit_depletion_prompt BOOLEAN NOT NULL DEFAULT FALSE,
  first_login_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_onboarding
CREATE POLICY "Users can view their own onboarding status"
  ON public.user_onboarding
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding status"
  ON public.user_onboarding
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding status"
  ON public.user_onboarding
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update handle_new_user to also create onboarding record
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
  
  -- Insert into user_credits table with 5 free credits
  INSERT INTO public.user_credits (user_id, current_balance, total_purchased, total_used)
  VALUES (NEW.id, 5, 5, 0);
  
  -- Create a transaction record for the free credits
  INSERT INTO public.credit_transactions (
    user_id,
    transaction_type,
    amount,
    description,
    created_by
  ) VALUES (
    NEW.id,
    'purchase',
    5,
    'Welcome bonus - 5 free credits',
    NEW.id
  );
  
  -- Create onboarding record
  INSERT INTO public.user_onboarding (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;
