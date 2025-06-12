
-- Create database functions to interact with the logo_configuration table

-- Function to get logo configuration for a user
CREATE OR REPLACE FUNCTION public.get_logo_config(user_id uuid)
RETURNS TABLE(active_logo_url text, fallback_logo_url text)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT active_logo_url, fallback_logo_url
  FROM public.logo_configuration
  WHERE logo_configuration.user_id = get_logo_config.user_id;
$$;

-- Function to create logo configuration for a user
CREATE OR REPLACE FUNCTION public.create_logo_config(
  user_id uuid,
  active_logo_url text,
  fallback_logo_url text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.logo_configuration (user_id, active_logo_url, fallback_logo_url)
  VALUES (user_id, active_logo_url, fallback_logo_url)
  ON CONFLICT (user_id) DO NOTHING;
$$;

-- Function to update logo configuration for a user
CREATE OR REPLACE FUNCTION public.update_logo_config(
  user_id uuid,
  new_active_logo_url text,
  new_fallback_logo_url text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.logo_configuration (user_id, active_logo_url, fallback_logo_url)
  VALUES (user_id, new_active_logo_url, new_fallback_logo_url)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    active_logo_url = new_active_logo_url,
    fallback_logo_url = new_fallback_logo_url,
    updated_at = now();
$$;
