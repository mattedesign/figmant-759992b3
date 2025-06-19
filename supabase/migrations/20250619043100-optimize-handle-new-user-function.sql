
-- Optimize the handle_new_user function with better error handling and retry logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  retry_count integer := 0;
  max_retries integer := 3;
  retry_delay interval := '100 milliseconds';
BEGIN
  -- Add a small delay to allow auth.users transaction to fully commit
  PERFORM pg_sleep(0.1);
  
  WHILE retry_count < max_retries LOOP
    BEGIN
      -- Insert into profiles table with enhanced data extraction
      INSERT INTO public.profiles (id, email, full_name, avatar_url, provider, provider_id, role)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
          NEW.raw_user_meta_data ->> 'full_name',
          NEW.raw_user_meta_data ->> 'name',
          CONCAT(
            COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
            CASE 
              WHEN NEW.raw_user_meta_data ->> 'last_name' IS NOT NULL 
              THEN ' ' || (NEW.raw_user_meta_data ->> 'last_name')
              ELSE ''
            END
          ),
          split_part(NEW.email, '@', 1) -- Fallback to email username
        ),
        NEW.raw_user_meta_data ->> 'avatar_url',
        COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email'),
        NEW.raw_user_meta_data ->> 'provider_id',
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
      
      -- If we get here, everything succeeded
      EXIT;
      
    EXCEPTION
      WHEN OTHERS THEN
        retry_count := retry_count + 1;
        
        -- Log the error with retry information
        RAISE WARNING 'Error in handle_new_user (attempt %/%): % - %', 
          retry_count, max_retries, SQLSTATE, SQLERRM;
        
        -- If this was the last retry, still return NEW to not block user creation
        IF retry_count >= max_retries THEN
          RAISE WARNING 'handle_new_user failed after % attempts for user %', 
            max_retries, NEW.id;
          -- Create a recovery record for manual intervention
          INSERT INTO public.user_activity_logs (
            user_id, 
            activity_type, 
            metadata
          ) VALUES (
            NEW.id,
            'profile_creation_failed',
            jsonb_build_object(
              'error', SQLERRM,
              'sqlstate', SQLSTATE,
              'attempts', retry_count,
              'email', NEW.email,
              'created_at', now()
            )
          );
          EXIT;
        END IF;
        
        -- Wait before retrying
        PERFORM pg_sleep(extract(epoch from retry_delay));
        retry_delay := retry_delay * 2; -- Exponential backoff
    END;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Add an index to improve profile lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Add an index for faster activity log queries
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type_user 
ON public.user_activity_logs(activity_type, user_id, created_at);
