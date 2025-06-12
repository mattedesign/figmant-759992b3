
-- Create the design-uploads storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('design-uploads', 'design-uploads', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Authenticated users can upload to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete design-uploads" ON storage.objects;

-- Create RLS policies for the design-uploads bucket
CREATE POLICY "Authenticated users can upload to design-uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Public read access to design-uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'design-uploads');

CREATE POLICY "Authenticated users can update design-uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete design-uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

-- Enable RLS on logo_configuration table if not already enabled
ALTER TABLE public.logo_configuration ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can insert their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can update their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can delete their own logo configuration" ON public.logo_configuration;

-- Add RLS policies for logo_configuration table
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
