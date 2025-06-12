
-- Create a public logo configuration table that doesn't require authentication
CREATE TABLE public.public_logo_configuration (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key text NOT NULL UNIQUE,
  logo_url text NOT NULL,
  fallback_logo_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default configuration
INSERT INTO public.public_logo_configuration (config_key, logo_url, fallback_logo_url)
VALUES ('default', 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/branding/logo/figmant-logo.png', 'https://okvsvrcphudxxrdonfvp.supabase.co/storage/v1/object/public/design-uploads/assets/branding/logo/figmant-logo.png');

-- Create trigger for updated_at
CREATE TRIGGER update_public_logo_configuration_updated_at
  BEFORE UPDATE ON public.public_logo_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get public logo configuration (no auth required)
CREATE OR REPLACE FUNCTION public.get_public_logo_config()
RETURNS TABLE(logo_url text, fallback_logo_url text)
LANGUAGE sql
STABLE
AS $$
  SELECT logo_url, fallback_logo_url
  FROM public.public_logo_configuration
  WHERE config_key = 'default' AND is_active = true
  LIMIT 1;
$$;

-- Create function to update public logo configuration (owner only)
CREATE OR REPLACE FUNCTION public.update_public_logo_config(
  new_logo_url text,
  new_fallback_logo_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has permission (must be owner)
  IF NOT public.has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Only owners can modify public logo configuration';
  END IF;

  -- Update or insert the default configuration
  INSERT INTO public.public_logo_configuration (config_key, logo_url, fallback_logo_url)
  VALUES ('default', new_logo_url, new_fallback_logo_url)
  ON CONFLICT (config_key) 
  DO UPDATE SET 
    logo_url = new_logo_url,
    fallback_logo_url = new_fallback_logo_url,
    updated_at = now();
END;
$$;
