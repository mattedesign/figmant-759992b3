
-- Create the logo_configuration table
CREATE TABLE public.logo_configuration (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  active_logo_url text NOT NULL,
  fallback_logo_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.logo_configuration ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own logo configuration"
  ON public.logo_configuration
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logo configuration"
  ON public.logo_configuration
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logo configuration"
  ON public.logo_configuration
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logo configuration"
  ON public.logo_configuration
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_logo_configuration_updated_at
  BEFORE UPDATE ON public.logo_configuration
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
